# DentiCheck: AI-Powered Dental Intelligence & Ecosystem

## Inspiration
Dental health is a critical component of overall well-being, yet it is often the most neglected. Cavities, gum diseases, and oral cancers frequently go undetected in their early stages because professional consultations can be expensive, time-consuming, or intimidating. Existing digital health solutions are often fragmented—offering either generic advice or isolated image analysis without professional context.

We asked: **What if users could get a professional-grade dental preliminary checkup using nothing more than their smartphone?**

DentiCheck was inspired by the desire to democratize dental health. Our goal is to provide an accessible, reliable, and actionable "first line of defense" that transforms a simple photo into a structured medical intelligence report, connecting users with the right care at the right time.

## What it does
DentiCheck is an all-in-one dental healthcare platform that combines computer vision and generative AI to analyze 구강(oral) health.

*   **AI Visual Diagnosis**: Analyzes user-uploaded photos to detect cavities, tartar, and periodontal issues using fine-tuned **YOLOv8** models.
*   **Medical Intelligence (RAG)**: Instead of generic AI responses, our system uses **Retrieval-Augmented Generation** to anchor analysis in verified dental science, providing trustable explanations.
*   **Risk Scoring Engine**: Calculates a structured risk level (Low, Moderate, High) based on detection severity and confidence.
*   **Professional Reporting**: Generates a downloadable **PDF Health Report** summarizing findings, risk levels, and recommended actions.
*   **Integrated Ecosystem**: Matches users with partner hospitals (via Kakao Maps), recommended dental products, and insurance plans tailored to their diagnosis.
*   **Admin Management**: A comprehensive dashboard for managing users, tracking platform stats, and managing dental/product partnerships with high-performance pagination.

## How we built it
The project is built on a modern, decoupled architecture designed for high-load AI processing and seamless cross-platform delivery.

### **AI Service Layer (Python/Kedro)**
*   **Detection**: Fine-tuned **YOLOv8** for tooth-specific anomaly detection with bounding-box output.
*   **Logic**: **Kedro** pipelines for data transformation and analysis workflow management.
*   **LLM & RAG**: **LangChain** integrated with OpenAI and **Milvus** vector database of dental knowledge to ensure evidence-based explanations.
*   **English-First Policy**: All AI prompts and outputs are strictly enforced in English for global scalability.

### **Backend API Layer (Java/Spring Boot)**
*   **Architecture**: Domain-driven design with a unified **GraphQL** API layer for both Mobile and Console.
*   **Data**: **Spring Data JPA** with **PostgreSQL** for robust data management and transactional integrity.
*   **Integration**: Seamless orchestration between the mobile app, admin console, and AI microservice.

### **Frontend & Mobile Layer (TypeScript)**
*   **App**: **Expo (React Native)** providing a fast, native-feeling experience on both iOS and Android.
*   **Console**: **Vite + React** for a high-performance, responsive admin dashboard.
*   **UI/UX**: **Tailwind CSS** for consistent, modern design across all interfaces.

## Challenges we ran into
*   **The "Hallucination" Hurdle**: In healthcare, accuracy is non-negotiable. Standard LLMs can hallucinate medical advice. We overcame this by implementing a **RAG pipeline** that forces the AI to check its "knowledge base" before speaking.
*   **Image Variability**: Real-world photos have inconsistent lighting and angles. We had to perform extensive image augmentation and preprocessing to make the YOLO detection resilient.
*   **Legacy Systems Integration**: Unifying a legacy AI implementation with a modern Spring Boot backend required careful schema design and a custom compatibility layer.
*   **Localization Consistency**: Ensuring that the AI strictly adheres to a professional English persona while handling diverse user inputs required complex prompt engineering.

## Accomplishments that we're proud of
*   **Successful YOLO Fine-tuning**: Achieving high precision and recall on dental anomaly detection.
*   **End-to-End Pipeline**: A fully automated flow from "Photo Taken" to "PDF Report Downloaded" that works in seconds.
*   **Scalable Admin Infrastructure**: Implementing a management system that handles complex data (search, filter, pagination) with sub-second response times.
*   **Medical Credibility**: Building a system that doesn't just "guess" but explains its reasoning based on extracted medical text.

## What we learned
*   **Actionability > Detection**: Users don't just want to know they have a cavity; they want to know *how bad* it is and *where to go*.
*   **Backend Orchestration is Crucial**: AI is the "brain," but the Backend is the "nervous system." Without a robust API and database structure, the AI's value cannot reach the user.
*   **Trust is a Feature**: Transparency in how risks are calculated and providing evidence-based explanations are the most important features in health-tech.
*   **Cross-Domain Synergy**: Effective collaboration between AI engineers, Backend developers, and UI designers is required to build a truly cohesive product.

## What's next for DentiCheck
*   **Augmented Reality (AR)**: Real-time dental scanning guidance to help users take perfect photos.
*   **B2B Integration**: Directly piping reports into hospital EMR (Electronic Medical Record) systems for seamless treatment transitions.
*   **Video Analysis**: Moving from static images to video-based scanning for a more comprehensive 3D oral checkup.
*   **Global Expansion**: Expanding the medical knowledge base to include regional dental standards and deeper insurance integrations.

---
**DentiCheck: Transforming Dental Care, One Byte at a Time.**
