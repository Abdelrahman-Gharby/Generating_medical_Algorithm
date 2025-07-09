from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests

import os, json
import google.generativeai as genai
from PIL import Image
import re

genai.configure(api_key="AIzaSyAMCJ99KtRWxHrYtHVE7_H9IRvJ-u6fWG4")

_MODEL_NAME   = "gemini-2.5-pro"
_PROMPT       ="""
        You are an expert medical-algorithm analyst.
        The user will supply an image that contains a diagnostic flow-chart.
        Your job is to:
        1. Read the text (perform OCR).
        2. Convert the decision tree into a *strictly valid* JSON object whose schema is:

        {
        "algorithm": {
            "steps": [
            {
                "step": <integer>,
                "Question": <string> | null,
                "Action":   <string> | null,
                "options": [
                { "answer": <string>, "nextStep": <integer> }
                ]
            }
            ]
        }
        }

        - `Question` and `Action` are mutually exclusive.
        - Follow the step numbers exactly as seen in the chart.
        - Preserve all clinical wording.
        - Do **not** add explanations or markdown.
        Return *only* the JSON.
"""      
_GEN_CFG      = {"temperature": 0.0, "max_output_tokens": 10_000}
_SAFETY       = {
    "HARASSMENT": "block_none",
    "HATE": "block_none",
    "SEXUAL": "block_none",
    "DANGEROUS": "block_none",
}


_FENCE = re.compile(r"^\s*```(?:json)?\s*|\s*```\s*$", re.IGNORECASE)

def _strip_md(text: str) -> str:
    """Drop markdown fences so only raw JSON remains."""
    return _FENCE.sub("", text).strip()
   
def _json_from_stream(stream):
    parts = [chunk.text for chunk in stream if chunk.text]
    raw   = "".join(parts)
    # print("====== RAW FROM GEMINI ======")
    # print(raw)                       #  ← debug line
    # print("========== END ==========")

    clean = _strip_md(raw).strip()
    # print("====== AFTER STRIP ========")
    # print(clean)                     #  ← debug line
    # print("========== END ==========")

    return json.loads(clean) 



class ConvertImageView(APIView):
    permission_classes = []

    def post(self, request):
        img_file = request.FILES.get("image")
        if not img_file:
            return Response({"error": "No image provided"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            pil_img = Image.open(img_file).convert("RGB")

            model  = genai.GenerativeModel(
                _MODEL_NAME,
                generation_config=_GEN_CFG,
                safety_settings=_SAFETY,
            )

            stream = model.generate_content([_PROMPT, pil_img], stream=True)
            data   = _json_from_stream(stream)

            return Response(data, status=status.HTTP_200_OK)

        # bad JSON coming back from Gemini
        except json.JSONDecodeError as bad:
            return Response({"error": f"Gemini JSON error: {bad}"},
                            status=status.HTTP_502_BAD_GATEWAY)

        # anything else (network, quota, etc.)
        except Exception as exc:
            return Response({"error": str(exc)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class GenerateAlgorithmView(APIView):
    def post(self, request):
        disease_name = request.data.get('disease_name')
        if not disease_name:
            return Response({"error": "Missing disease_name"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # The actual ngrok URL used
            fastapi_url = 'https://6cd1e30f57b7.ngrok-free.app//generate_algorithm'

            fastapi_response = requests.post(fastapi_url, json={"disease_name": disease_name})

            if fastapi_response.status_code != 200:
                return Response({
                    "error": "FastAPI returned an error",
                    "details": fastapi_response.text
                }, status=fastapi_response.status_code)

            return Response(fastapi_response.json(), status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
