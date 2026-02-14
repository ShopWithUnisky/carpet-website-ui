import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

type Tokens = {
  // authToken: string | null;
  // refreshToken: string | null;
  token: string | null;
};

interface ApiResponseError {
  error?: string | Record<string, string[]>;
  msg?: string;
  message?: string;
  sucess?: boolean;
  success?: boolean;
}

type ApiCallOptions = {
  responseType?: AxiosRequestConfig["responseType"];
};

const getErrorMessage = (errorBody: ApiResponseError): string => {
  if (typeof errorBody?.error === "string") {
    return errorBody.error;
  }
  return errorBody?.msg || errorBody?.message || "No response from server";
};

const getTokens = async (): Promise<Tokens> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  return { token };
};

export const apiCall = async <T, P, B>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  params: P = {} as P,
  body: B = {} as B,
): Promise<T> => {
  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
    params,
    // withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    ...(method !== "GET" && { data: body }),
  };

  try {
    const response: AxiosResponse<T> = await axios(axiosConfig);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponseError>;

    if (axiosError.response) {
      const errorBody = axiosError.response.data;
      const message = getErrorMessage(errorBody);
      console.error(message);
      throw new Error(message);
    } else if (axiosError.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(`Unexpected error: ${axiosError.message}`);
    }
  }
};

export const apiCallWithAuth = async <T, P, B>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  params: P = {} as P,
  body: B = {} as B,
  options: ApiCallOptions = {},
): Promise<T> => {
  const { token } = await getTokens();

  if (!token) {
    throw new Error("No auth token found");
  }

  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
    params,
    withCredentials: true,
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
    responseType: options.responseType,
    ...(method !== "GET" && { data: body }),
  };

  try {
    const response: AxiosResponse<T> = await axios(axiosConfig);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponseError>;

    if (axiosError.response) {
      const errorBody = axiosError.response.data;
      const errorMessage = getErrorMessage(errorBody);
      console.error(errorMessage);
      // console.error("API error:", errorBody);
      throw new Error(errorMessage);
    } else if (axiosError.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(`Unexpected error: ${axiosError.message}`);
    }
  }
};

export const apiCallWithFormData = async <T, P>(
  method: "POST" | "PUT" = "POST",
  url: string,
  params: P = {} as P,
  body: FormData | undefined,
): Promise<T> => {
  const { token } = await getTokens();

  if (!token) {
    throw new Error("No auth token found");
  }

  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
    params,
    withCredentials: true,
    headers: {
      token: token,
      "Content-Type": "multipart/form-data",
    },
    data: body,
  };

  try {
    const response: AxiosResponse<T> = await axios(axiosConfig);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponseError>;

    if (axiosError.response) {
      const errorBody = axiosError.response.data;
      const errorMessage = getErrorMessage(errorBody);
      console.error(errorMessage);
      // console.error("API error:", errorBody);
      throw new Error(errorMessage);
    } else if (axiosError.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error(`Unexpected error: ${axiosError.message}`);
    }
  }
};
