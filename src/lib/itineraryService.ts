import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Itinerary, Keyword } from "@/types/itinerary";

const ITINERARIES_COLLECTION = "itineraries";
const KEYWORDS_COLLECTION = "keywords";

// Helper to convert Firestore timestamps to Date
const convertTimestamps = (data: any): any => {
  if (data === null || data === undefined) return data;
  if (data instanceof Timestamp) return data.toDate();
  if (Array.isArray(data)) return data.map(convertTimestamps);
  if (typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = convertTimestamps(data[key]);
      return acc;
    }, {} as any);
  }
  return data;
};

// Helper to convert Dates to Firestore timestamps
const convertDates = (data: any): any => {
  if (data === null || data === undefined) return data;
  if (data instanceof Date) return Timestamp.fromDate(data);
  if (Array.isArray(data)) return data.map(convertDates);
  if (typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = convertDates(data[key]);
      return acc;
    }, {} as any);
  }
  return data;
};

// Generate next itinerary code
export const generateItineraryCode = async (): Promise<string> => {
  const year = new Date().getFullYear().toString().slice(-2);
  const prefix = `AH${year}-DOM-FIT-`;
  
  const q = query(
    collection(db, ITINERARIES_COLLECTION),
    orderBy("createdAt", "desc")
  );
  
  const snapshot = await getDocs(q);
  let maxNumber = 0;
  
  snapshot.forEach((doc) => {
    const code = doc.data().itineraryCode;
    if (code && code.startsWith(prefix)) {
      const num = parseInt(code.replace(prefix, ""), 10);
      if (num > maxNumber) maxNumber = num;
    }
  });
  
  return `${prefix}${String(maxNumber + 1).padStart(3, "0")}`;
};

// Itinerary CRUD
export const getItineraries = async (): Promise<Itinerary[]> => {
  const q = query(
    collection(db, ITINERARIES_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Itinerary[];
};

export const getItinerary = async (id: string): Promise<Itinerary | null> => {
  const docRef = doc(db, ITINERARIES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return {
    id: docSnap.id,
    ...convertTimestamps(docSnap.data()),
  } as Itinerary;
};

export const createItinerary = async (data: Omit<Itinerary, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const now = new Date();
  const docRef = await addDoc(collection(db, ITINERARIES_COLLECTION), convertDates({
    ...data,
    createdAt: now,
    updatedAt: now,
  }));
  return docRef.id;
};

export const updateItinerary = async (id: string, data: Partial<Itinerary>): Promise<void> => {
  const docRef = doc(db, ITINERARIES_COLLECTION, id);
  await updateDoc(docRef, convertDates({
    ...data,
    updatedAt: new Date(),
  }));
};

export const deleteItinerary = async (id: string): Promise<void> => {
  const docRef = doc(db, ITINERARIES_COLLECTION, id);
  await deleteDoc(docRef);
};

export const duplicateItinerary = async (id: string): Promise<string> => {
  const original = await getItinerary(id);
  if (!original) throw new Error("Itinerary not found");
  
  const newCode = await generateItineraryCode();
  const { id: _, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = original;
  
  return createItinerary({
    ...rest,
    itineraryCode: newCode,
    clientName: `${rest.clientName} (Copy)`,
  });
};

// Keyword CRUD
export const getKeywords = async (): Promise<Keyword[]> => {
  const q = query(
    collection(db, KEYWORDS_COLLECTION),
    orderBy("keyword", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Keyword[];
};

export const getKeyword = async (id: string): Promise<Keyword | null> => {
  const docRef = doc(db, KEYWORDS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return {
    id: docSnap.id,
    ...convertTimestamps(docSnap.data()),
  } as Keyword;
};

export const searchKeywords = async (searchTerm: string): Promise<Keyword[]> => {
  const keywords = await getKeywords();
  const term = searchTerm.toLowerCase();
  return keywords.filter((k) => 
    k.keyword.toLowerCase().includes(term)
  );
};

export const createKeyword = async (data: Omit<Keyword, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  // Check for uniqueness
  const existing = await getKeywords();
  if (existing.some((k) => k.keyword.toLowerCase() === data.keyword.toLowerCase())) {
    throw new Error("Keyword already exists");
  }
  
  const now = new Date();
  const docRef = await addDoc(collection(db, KEYWORDS_COLLECTION), convertDates({
    ...data,
    createdAt: now,
    updatedAt: now,
  }));
  return docRef.id;
};

export const updateKeyword = async (id: string, data: Partial<Keyword>): Promise<void> => {
  const docRef = doc(db, KEYWORDS_COLLECTION, id);
  await updateDoc(docRef, convertDates({
    ...data,
    updatedAt: new Date(),
  }));
};

export const deleteKeyword = async (id: string): Promise<void> => {
  const docRef = doc(db, KEYWORDS_COLLECTION, id);
  await deleteDoc(docRef);
};
