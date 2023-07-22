import { CreateImageRequest, ImagesResponse, OpenAIApi } from "openai";
import { AxiosRequestConfig, AxiosResponse } from "axios";

const pollingInterval = 1000;

export class AzureOpenAIApi extends OpenAIApi {
  public createImage(
    createImageRequest: CreateImageRequest,
    options?: AxiosRequestConfig
  ) {
    const createImageUrl =
      (this.configuration?.basePath || this.basePath) +
      "/images/generations:submit";

    const axiosRequestConfig: AxiosRequestConfig = {
      ...options,
      ...this.configuration?.baseOptions,
      responseType: "json",
    };

    return this.axios
      .post(createImageUrl, createImageRequest, axiosRequestConfig)
      .then((response) => {
        const operationId = response.data.id;
        return this.getImage(operationId, options);
      })
      .catch((error) => {
        return error;
      });
  }

  public getImage(operationId: string, options?: AxiosRequestConfig) {
    const getImageUrl =
      (this.configuration?.basePath || this.basePath) +
      "/operations/images/" +
      operationId;

    const axiosRequestConfig: AxiosRequestConfig = {
      ...options,
      ...this.configuration?.baseOptions,
      responseType: "json",
    };

    return new Promise<AxiosResponse<ImagesResponse, any>>(
      (resolve, reject) => {
        const intervalId = setInterval(() => {
          // Call the image retrieval API
          this.axios
            .get(getImageUrl, axiosRequestConfig)
            .then((response) => {
              // If it is the termination status, end polling
              const finishedStatus = [
                "succeeded",
                "canceled",
                "failed",
                "deleted",
              ];
              if (finishedStatus.includes(response.data.status)) {
                clearInterval(intervalId);
                if (response.data.result) {
                  // Return only data that complies with the OpenAI API specifications.
                  response.data = response.data.result;
                }
                resolve(response);
              }
            })
            .catch((error) => {
              // If an error occurs, reject the Promise
              clearInterval(intervalId);
              reject(error);
            });
        }, pollingInterval);
      }
    );
  }
}
