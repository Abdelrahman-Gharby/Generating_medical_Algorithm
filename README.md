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
