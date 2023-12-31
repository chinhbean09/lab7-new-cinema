import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import UpdateNews from './updatefilm';
import { Button } from '@mui/material';
import { UseAuth } from '../services/AuthConext';
import { Navigate } from 'react-router-dom';
import ModalAddNews from './insertfilm';
import ModalDelete from './deleteFilm';

const DashboardHome = () => {
    const { user } = UseAuth();
    const [News, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [editNewsData, setEditNewsData] = useState({});
    const [idToUpdate, setIdToUpdate] = useState(null);
    const [idToDelete, setIdToDelete] = useState(null);
    console.log(News)
    console.log()
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);

    const handleCloseEdit = () => {
        setShowEdit(false);
        setIdToUpdate(null);
    };

    const handleShowEdit = (data) => {
        setEditNewsData(data);
        setIdToUpdate(News.id);
        setShowEdit(true);
    };
    const handleShowDelete = (data) => {
        setEditNewsData(data);
        setIdToDelete(data.id);
        setShowDelete(true);
    };
    const handleUpdate = () => {
        getAllNews();
        handleCloseAdd();
        handleCloseEdit();
    };


    const handleDelete = () => {
        getAllNews();
        handleCloseAdd();
        handleCloseEdit();
        handleCloseDelete();
    };

    const handleCloseDelete = () => {
        setShowDelete(false);
        setIdToDelete(null);
    };

    const getAllNews = async () => {
        const res = await axios.get('https://654a0640e182221f8d525970.mockapi.io/films');
        if (res && res.data) {
            setNews(res.data);
        }
    };

    useEffect(() => {
        getAllNews();
    }, []);

    const maxPage = Math.ceil(News.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= maxPage) {
            setCurrentPage(pageNumber);
        }
    };
    if (!user) {
        return <Navigate to="/login" />;
    }
    return (
        
        <div style={{ marginTop: '100px' }} className='tintucStaff-container'>
            <Button variant="outlined" color='success' onClick={handleShowAdd} size='large' id='btn-add-staff-dashboard'>
                Add News
            </Button>
            <h3>API trên mockapi của em có vấn đề(đôi khi không hoạt động)</h3>
            <h3>Nếu thầy thực hiện Delete, Update thì phải Add News rồi mới thực hiện được</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Categories</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {News.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((data, index) => (
                        <tr key={index}>
                            <td>{data.id}</td>
                            <td>{data.name}</td>
                            <td>{data.categorie}</td>
                            <td>
                                <Button variant="outlined" onClick={() => handleShowEdit(data)} className='edit-button'>Edit  <span style={{ paddingLeft: '5px' }} class="bi bi-pencil-square"></span></Button>
                                <Button variant="outlined" color='error' onClick={() => handleShowDelete(data)} style={{ marginLeft: '20px' }} className='delete-button '>Delete<span style={{ paddingLeft: '5px' }} class="bi bi-trash3-fill"></span></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination>
                <Pagination.Prev
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {Array.from({ length: maxPage }, (_, i) => (
                    <Pagination.Item
                        key={i}
                        onClick={() => paginate(i + 1)}
                        active={currentPage === i + 1}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === maxPage}
                />
            </Pagination>

            <ModalAddNews
                show={showAdd}
                handleClose={handleCloseAdd}
                handleUpdate={handleUpdate}
            />

            <UpdateNews
                show={showEdit}
                handleClose={handleCloseEdit}
                idToUpdate={idToUpdate}
                newsData={editNewsData}
                handleUpdate={handleUpdate}
            />
            <ModalDelete
                show={showDelete}
                handleClose={handleCloseDelete}
                idToDelete={idToDelete}
                handleDelete={handleDelete}
            />
        </div>
    );
};

export default DashboardHome;
