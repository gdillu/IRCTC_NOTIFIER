import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Derive __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the image paths using __dirname
const imagePath = path.join(__dirname, '..', '..','captcha.jpg');
const processedImagePath = path.join(__dirname, '..', '..','processed_captcha.jpg');

// Function to preprocess the image and perform OCR
export const processImageAndRecognizeText = async () => {
  try {
    // Pre-process the image (grayscale and thresholding)
    await sharp(imagePath)
      .grayscale()         // Convert to grayscale
      .threshold(150)      // Apply binarization threshold
      .toFile(processedImagePath);

    console.log('Image pre-processing completed.');

    // Perform OCR on the pre-processed image
    const { data: { text } } = await Tesseract.recognize(
      processedImagePath,
      'eng',
    );

    return text.trim();
  } catch (error) {
    console.error('Error during processing or OCR:', error);
  }
};
