# Generating_medical_Algorithm
# video Demo : https://youtu.be/BgeXVbxDbNQ
# Overview
🔍 Introduction
This graduation project is an AI-powered medical assistant designed to automatically generate medical decision algorithms based on disease names. The system combines fine-tuned language models with web crawling and interactive visualization to help medical professionals and students make accurate, evidence-based decisions.

💡 Why it's important:
Doctors rely on structured decision algorithms to make critical choices. Manual creation is time-consuming and often lacks up-to-date references. This tool automates the generation of clinical pathways using cutting-edge LLMs and medical sources (e.g. WHO, NICE, CDC), helping improve efficiency, accuracy, and accessibility in healthcare.
# LLaMA 3.2 and LoRA Fine-Tuning 
LLaMA 3.2 is a state-of-the-art large language model that excels at generating contextually 
relevant and linguistically fluent text. Due to its open architecture and support for research and 
customization, it was ideal for our medical domain application. 
However, to adapt LLaMA 3.2 to generate domain-specific medical algorithms, we performed 
LoRA (Low-Rank Adaptation) fine-tuning. This technique reduces the number of trainable 
parameters significantly by introducing low-rank matrices into the attention and feed-forward 
layers of the transformer, allowing efficient training even on limited GPU resources. 
https://colab.research.google.com/drive/1NoGiqjsWH15F6eObWdJRdiY_l7MZyLq3?usp=sharing 
# Performance Optimization with vLLM
algorithm, making real-time user experience impractical. To overcome this limitation, we 
integrated the vLLM (Virtualization of LLMs) inference engine. 
vLLM is designed to enable high-throughput, low-latency serving of LLMs by using continuous 
batching and memory-efficient attention mechanisms. This change reduced the generation 
latency from 60 seconds down to approximately 12 seconds, representing a 76% improvement 
in response time. https://colab.research.google.com/drive/1m6_SmDeXZBsg8hhFG36wuBSFU8OXC4iM?usp=sharing
# Medical Crawling Engine  
Medical accuracy and credibility are vital to the success of any clinical decision support tool. To 
ensure that each step in the generated algorithms is traceable to a reliable source, we 
implemented a custom crawling engine. 
This engine automatically queries well-known medical organizations including: 
 
• World Health Organization (WHO) 
• Centers for Disease Control and Prevention (CDC) 
• National Institute for Health and Care Excellence (NICE) 
The engine scrapes structured content from these websites by targeting pages specific to the 
disease in question. Extracted information includes treatment guidelines, diagnostic 
procedures, and recommended interventions. These references are then matched to the 
generated algorithm steps, ensuring that each clinical decision node can be justified with a 
trusted citation. https://colab.research.google.com/drive/1Xch4KGXhGBVDw5YJldFDtPxfXrPt5Xmb?usp=sharing
 
# Retrieval-Augmented Generation with LangChain and RAG 
 
To further improve the model's grounding and adaptability, we implemented a retrieval
augmented generation (RAG) pipeline using LangChain. 
The architecture is as follows: 
 
1. Medical PDF and guideline ingestion: Documents and flowcharts from reliable 
sources are parsed and stored as vector embeddings. 
2. Cosine similarity retrieval: When a user requests an algorithm, the system retrieves 
the top-matching existing algorithms or guideline chunks using cosine similarity.
4. Context-aware generation: These retrieved examples are fed into the LLaMA 3.2 
model as contextual prompts, guiding the generation towards medically sound outputs. 
LangChain provides the orchestration framework to integrate the retriever (using FAISS or 
ChromaDB) and the LLM generator. This hybrid approach ensures that generated outputs 
remain grounded in previously vetted material, significantly reducing hallucination risk and 
increasing user trust. https://colab.research.google.com/drive/1Xch4KGXhGBVDw5YJldFDtPxfXrPt5Xmb?usp=sharing
# web Application
Frontend: Built with React using ReactFlow to display the decision tree.

Backend: Developed using Django to handle model requests and user authentication.

 Key Features
 1. User Login / Signup

 2. Input a disease name and generate the algorithm.

 3. Visual algorithm generation using ReactFlow.

 4. Interactive UI with commenting/editing options.
