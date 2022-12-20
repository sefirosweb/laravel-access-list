import { APP_URL } from "@/types/configurationType"
import axios from "axios"

type ModelDefinition = {
    id: string,
    columns: Array<{
        field: string,
        fieldType: string,
    }>,
    hidden: Array<string>,
    softDelete: boolean
}

export const getUserFillableData = (): Promise<ModelDefinition> => {
    return new Promise((resolve, reject) => {
        axios.get<ModelDefinition>(`${APP_URL}/get_user_fillable_data`)
            .then((response) => resolve(response.data))
            .catch(reject)
    })
}