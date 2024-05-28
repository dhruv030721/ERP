import axios, { AxiosRequestConfig, Method } from "axios";

export const axiosInstance = axios.create({});

interface ApiConnectorParams {
  method: Method;
  url: string;
  bodyData?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export const apiConnector = ({
  method,
  url,
  bodyData,
  headers,
  params,
}: ApiConnectorParams) => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data: bodyData || undefined,
    headers: headers || undefined,
    params: params || undefined,
  };

  return axiosInstance(config);
};
