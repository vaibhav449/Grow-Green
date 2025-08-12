import { useNavigate } from 'react-router-dom';
function AdminHome(){
    const navigate = useNavigate();
    function handleClick(e) {
        e.preventDefault();
        navigate('/admin/addProduct');
    }
    return (
        <div>
        <h1>Admin Home</h1>
        <button onClick={handleClick} className="bg-red-200 rounded-md">Add a product</button>
        </div>
    );
}
export default AdminHome;