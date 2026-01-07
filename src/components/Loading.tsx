import { useEffect } from "react";
import { useLoading } from "../contexts/LoadingContext";

export default function Loading({ isLoading = false }: { isLoading: boolean }) {
    const loader = useLoading();

    useEffect(() => {
        if (isLoading) {
            loader.startLoading();
        } else {
            loader.stopLoading();
        }
        return () => {
            if (isLoading) loader.stopLoading();
        }
    }, [isLoading]);
    return null
}

