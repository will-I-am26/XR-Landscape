import { Gemini } from "../Gemini";
import { GeminiTypes } from "../GeminiTypes";

@component
export class ExampleGeminiCalls extends BaseScriptComponent {
  @ui.separator
  @ui.group_start("Text Generation Example")
  @input
  textDisplay: Text;
  @input
  @widget(new TextAreaWidget())
  private modelPrompt: string =
    "You are an incredibly smart but witty AI assistant who likes to answers life's greatest mysteries in under two sentences";
  @input
  //@widget(new TextAreaWidget())
  private imgprompt: SceneObject;
  @input
  @label("Run On Tap")
  private doTextGenerationOnTap: boolean = false;
  @ui.group_end
  @ui.separator
  @ui.group_start("Image Generation Example")
  @input
  private imgObject: SceneObject;
  @input
  @widget(new TextAreaWidget())
  private imageGenerationPrompt: string = "The future of augmented reality";
  @input
  @label("Run On Tap")
  private generateImageOnTap: boolean = false;
  @ui.group_end
  @ui.separator
  @ui.group_start("Function Calling Example")
  @input
  @widget(new TextAreaWidget())
  private functionCallingPrompt: string = "Make the text display yellow";
  @input
  @label("Run On Tap")
  private doFunctionCallingOnTap: boolean = false;
  @ui.group_end
  private gestureModule: GestureModule = require("LensStudio:GestureModule");

  onAwake() {
    if (global.deviceInfoSystem.isEditor()) {
      this.createEvent("TapEvent").bind(() => {
        this.onTap();
      });
    } else {
      this.gestureModule
        .getPinchDownEvent(GestureModule.HandType.Right)
        .add(() => {
          this.onTap();
        });
    }
  }

  private onTap() {
    // if (this.generateImageOnTap) {
    //   this.generateImageExample();
    // }

    if (this.doTextGenerationOnTap) {
      this.ImgToTextExample();
    }

    // if (this.doFunctionCallingOnTap) {
    //   this.functionCallingExample();
    // }
  }

  ImgToTextExample(): void {
    this.textDisplay.sceneObject.enabled = true;
    this.textDisplay.text = "Generating...";
    // You need to obtain the base64 data from the image or texture you want to send.
    // For demonstration, we'll set b64Data to an empty string or fetch it from a valid source.
    let b64Data = ""; // TODO: Assign actual base64 image data here

     const imgComponent = this.imgprompt.getComponent("Image");
    if (!imgComponent || !imgComponent.mainPass.baseTex) {
        this.textDisplay.text = "Error: No image to analyze.";
        print("Error: The source Image component does not have a texture assigned.");
        return;
    }

    
     // Convert the texture to base64 (async)
    // Convert the texture to base64 (async)
    Base64.encodeTextureAsync(
      imgComponent.mainPass.baseTex,
      (b64Data) => {
        let request: GeminiTypes.Models.GenerateContentRequest = {
            model: "gemini-2.0-flash",
            type: "generateContent",
            body: {
                contents: [
                    {
                        parts: [
                            {
                                text: this.modelPrompt,
                            },
                        ],
                        role: "model",
                    },
                    {
                        parts: [
                            {
                                inlineData: {
                                    mimeType: "image/png",
                                    data: b64Data,
                                },
                            },
                        ],
                        role: "user",
                    },
                ],
            },
        };

        Gemini.models(request)
          .then((response) => {
            print("Gemini response: " + JSON.stringify(response));
            this.textDisplay.text = response.candidates[0].content.parts[0].text;
          })
          .catch((error) => {
            print("Gemini error: " + error);
            this.textDisplay.text = "Error: " + error;
          });
      },
      () => {
        print("Error encoding texture");
        this.textDisplay.text = "Error: Could not encode image.";
      },
      0.9, // compressionQuality (example value, adjust as needed)
      EncodingType.Jpg // encodingType (example value, adjust as needed)
    );
}


//   generateImageExample() {
//     this.imgObject.enabled = true;
//     let request: GeminiTypes.Models.GenerateContentRequest = {
//       model: "gemini-2.0-flash-preview-image-generation",
//       type: "generateContent",
//       body: {
//         contents: [
//           {
//             parts: [
//               {
//                 text: this.imageGenerationPrompt,
//               },
//             ],
//             role: "user",
//           },
//         ],
//         generationConfig: {
//           responseModalities: ["TEXT", "IMAGE"],
//         },
//       },
//     };
//     Gemini.models(request)
//       .then((response) => {
//         for (let part of response.candidates[0].content.parts) {
//           if (part?.inlineData) {
//             let b64Data = part.inlineData.data;
//             Base64.decodeTextureAsync(
//               b64Data,
//               (texture) => {
//                 let imgComponent = this.imgObject.getComponent("Image");
//                 let imageMaterial = imgComponent.mainMaterial.clone();
//                 imgComponent.mainMaterial = imageMaterial;
//                 imgComponent.mainPass.baseTex = texture;
//               },
//               () => {
//                 print("Failed to decode texture from base64 data.");
//               }
//             );
//           }
//         }
//       })
//       .catch((error) => {
//         print("Error while generating image: " + error);
//         this.textDisplay.text = "Error: " + error;
//       });
//   }

//   functionCallingExample() {
//     this.textDisplay.sceneObject.enabled = true;
//     this.textDisplay.text = "Processing function call...";

//     let request: GeminiTypes.Models.GenerateContentRequest = {
//       model: "gemini-2.5-flash",
//       type: "generateContent",
//       body: {
//         contents: [
//           {
//             parts: [
//               {
//                 text: this.functionCallingPrompt,
//               },
//             ],
//             role: "user",
//           },
//         ],
//         tools: [
//           {
//             functionDeclarations: [
//               {
//                 name: "set_text_color",
//                 description: "Set the color of the text display",
//                 parameters: {
//                   type: "object",
//                   properties: {
//                     red: {
//                       type: "number",
//                       description: "Red component of the color (0-255)",
//                     },
//                     green: { Generative AI request: " + error, {error: true});
// //         this.resultText.text = "Error: Request failed.";
// // //     });
// //                       type: "number",
// //                       description: "Green component of the color (0-255)",
// //                     },
// //                     blue: {
// //                       type: "number",
// //                       description: "Blue component of the color (0-255)",
// //                     },
// //                   },
// //                   required: ["red", "green", "blue"],
// //                 },
// //               },
// //             ],
// //           },
// //         ],
// //       },
// //     };

// // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // // This function sends the image and prompt to the AI for analysis.
// // // function analyzeImage() {
  

// // //     // Get the texture from the source Image component.
// // //     const imageTexture = this.imgprompt.mainPass.baseTex;

// // //     if (!imageTexture) {
// // //         print("Error: The source Image component does not have a texture assigned.", {error: true});
// // //         this.resultText.text = "Error: No image to analyze.";
// // //         return;
// // //     }

// // //     print("Sending request to Generative AI...");
// // //     this.resultText.text = "Analyzing..."; // Provide immediate feedback to the user.

// // //     // Use the GenerativeAIController's API to run the model.
// // //     // The module handles the network request and data conversion.
// // //     this.gemini.API.run({
// // //         prompt: this.prompt,
// // //         image: imageTexture,
// // //     })
// // //     .then((response: any) => {
// // //         // Handle a successful response from the API.
// // //         if (response && response.text) {
// // //             print("AI Response Received: " + response.text);
// // //             this.resultText.text = response.text; // Display the result.
// // //         } else {
// // //             print("Error: Received an invalid or empty response from the AI.", {error: true});
// // //             this.resultText.text = "Error: Invalid response.";
// // //         }
// // //     })
// // //     .catch((error: any) => {
// // //         // Handle any errors that occur during the API call.
// // //         print("Error during

}
