import { Schema, Document } from 'mongoose';

export interface MongoTracking extends Document {
  userId: string;
  vehicleId: number;
  latitude: string;
  longitude: string;
  timestamp: Date;
  fromDestination: string;
  toDestination: string;
}

export const TrackingSchema = new Schema({
  userId: { type: String, required: true },
  vehicleId: { type: Number, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  timestamp: { type: Date, required: true },
  fromDestination: { type: String, required: true },
  toDestination: { type: String, required: true },
});
