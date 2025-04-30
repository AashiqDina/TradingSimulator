import axios from "axios";

interface AxiosErrorType {
    response?: { data: string; status: number; statusText: string };
    message: string;
  }

export default function handleAxiosError(props: any){
    const handleAxiosError = (error: unknown) => {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosErrorType;
          const message = axiosError.response ? axiosError.response.data : axiosError.message;
          console.error("Error:", message);
        } else {
          console.error("Unknown error:", error);
        }
      };

    handleAxiosError(props.error)
}