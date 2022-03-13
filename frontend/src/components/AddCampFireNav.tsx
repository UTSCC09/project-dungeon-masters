import "../index.css";

export function AddCampFireNav(){
    return(<div className="top-0 w-full h-20 bg-rose-800 grid grid-cols-3 place-content-center">
    <div className="h-18 w-14 m-1 ml-5 btn btn_previous justify-self-start"/>
    <div className="text-6xl text-amber-300 place-self-center">Title</div>
    <div className="h-18 w-14 m-1 mr-5 btn btn_next justify-self-end"/>
    </div>);
}