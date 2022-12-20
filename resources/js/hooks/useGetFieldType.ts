import { FieldTypes } from "@sefirosweb/react-crud"

export const useGetFieldType = (type: string): FieldTypes => {
    if (type === 'number') return FieldTypes.NUMBER
    if (type === 'datetime') return FieldTypes.DATE
    return FieldTypes.TEXT
}