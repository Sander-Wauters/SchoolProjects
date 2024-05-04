import { isAxiosError } from "axios";

export default function Error({ error }) {
    if (isAxiosError(error)) {
        return (
            <>
                <p className={"error"}>
                    {error.response?.data?.message || error.message}
                    {/* error.response?.data?.details && (
                        <>
                            ; <br/> {JSON.stringify(error.response.data.details)}
                        </>
                    )*/}
                </p>
            </>
        );
    }

    if (error) {
        return (
            <>
                {error.message || JSON.stringify(error)}   
            </>
        );
    }

    return null;
}
