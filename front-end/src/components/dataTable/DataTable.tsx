import { Link } from "react-router-dom";
import "./dataTable.scss";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "react-query";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
};

const DataTable = (props: Props) => {
  // Dummy Data
  //   const columns: GridColDef[] = [
  //     { field: "id", headerName: "ID", width: 90 },
  //     {
  //       field: "avatar",
  //       headerName: "Avatar",
  //       width: 100,
  //       renderCell: (params) => {
  //         return <img src={params.row.img || "/noavatar.png"} />;
  //       },
  //     },
  //     {
  //       field: "actions",
  //       headerName: "Actions",
  //       width: 100,
  //       renderCell: (params) => {
  //         return (
  //           <div className="action">
  //             <div className="view">V</div>
  //             <div className="delete">D</div>
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       field: "Status",
  //       headerName: "Status",
  //       width: 100,
  //       type: "boolean",
  //     },
  //     {
  //       field: "firstName",
  //       headerName: "First name",
  //       width: 150,
  //       editable: true,
  //     },
  //     {
  //       field: "lastName",
  //       headerName: "Last name",
  //       width: 150,
  //       editable: true,
  //     },
  //     {
  //       field: "age",
  //       headerName: "Age",
  //       type: "number",
  //       width: 110,
  //       editable: true,
  //     },
  //     {
  //       field: "fullName",
  //       headerName: "Full name",
  //       description: "This column has a value getter and is not sortable.",
  //       sortable: false,
  //       width: 160,
  //       valueGetter: (params: GridValueGetterParams) =>
  //         `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  //     },
  //   ];

  //   const rows = [
  //     { id: 1, lastName: "Snow", firstName: "Jon", age: 35, Status: true },
  //     {
  //       id: 2,
  //       lastName: "Lannister",
  //       firstName: "Cersei",
  //       age: 42,
  //       Status: false,
  //     },
  //     { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  //     { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  //     { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  //     { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  //     { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  //     { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  //     { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  //   ];

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => {
      return fetch(`http://localhost:8800/api/${props.slug}/${id}`, {
        method: "delete",
      });
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries([`all${props.slug}`])
    }
  });

  const handleDelete = (id: number) => {
    // delete the item
    // axios.delete(`/api/${slug}/id`)

    mutation.mutate(id)

    console.log(id + " has been deleted");
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (param) => {
      return (
        <div className="action">
          <Link to={`/${props.slug}/${param.row.id}`}>
            <img src="/view.svg" alt="" />
          </Link>
          <div className="delete" onClick={(e) => handleDelete(param.row.id)}>
            <img src="/delete.svg" alt="" className="" />
          </div>
        </div>
      );
    },
  };
  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        // disableColumnSelector
      />
    </div>
  );
};

export default DataTable;
