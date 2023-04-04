import { ColumnDefinition, FieldTypes, MultiSelectOptionsColumns } from "@sefirosweb/react-crud";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUserFillableData } from "@/api/getUserFillableData";
import { useGetFieldType } from "./useGetFieldType";
import { APP_URL } from "@/types/configurationType";
import { useTranslation } from "react-i18next";

type Props = [primaryId: string, tableColumns: Array<ColumnDefinition<any>>, isSoftDelete: boolean]

export const useGetUserColumns = (): Props => {
    const [tableColumns, setTableColumns] = useState<Array<ColumnDefinition<any>>>([]);
    const [primaryId, setPrimaryId] = useState("");
    const [isSoftDelete, setIsSoftDelete] = useState(false)
    const { t, i18n } = useTranslation()


    const multiSelectRole: MultiSelectOptionsColumns<Role> = {
        primaryKey: 'id',
        sentKeyAs: "user_id",
        lazyLoad: true,
        url: `${APP_URL}/user/roles`,
        getDataUrl: `${APP_URL}/user/roles/get_array`,
        columns: [
            {
                header: '#',
                accessorKey: 'id'
            },
            {
                header: t('Name'),
                accessorKey: 'name'
            },
            {
                header: t('Description'),
                accessorKey: 'description'
            },
        ],
    }

    const { data } = useQuery({
        queryKey: [`${APP_URL}/get_user_fillable_data`],
        queryFn: () => getUserFillableData(),
        staleTime: Infinity,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if (!data) return
        const { id, columns, hidden, softDelete } = data

        setPrimaryId(id)
        setIsSoftDelete(softDelete)

        // For a now ignore getFieldTypEError
        //@ts-ignore
        const newColumns = columns.map<ColumnDefinition<any>>((column) => {
            return {
                header: column.field,
                accessorKey: column.field,
                visible: hidden.findIndex(columnHidden => columnHidden === column.field) < 0,
                fieldType: useGetFieldType(column.fieldType),
                editable: true
            }
        })

        newColumns.unshift({
            accessorKey: id,
            visible: false
        })

        newColumns.push({
            id: 'roles',
            titleOnCRUD: t('Roles'),
            header: t('Roles'),
            editable: true,
            fieldType: FieldTypes.MULTISELECT,
            multiSelectOptions: multiSelectRole
        })

        setTableColumns(newColumns)
    }, [data, i18n.language])

    return [primaryId, tableColumns, isSoftDelete]

}