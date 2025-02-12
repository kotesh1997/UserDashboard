import { Button } from '@mui/joy';
import './userDashboard.css';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import AddUser from '../components/add-user';
import UserDataTable from '../components/user-table';

const UserDashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onDialogSwitch = () => setIsOpen((open) => !open);

  const getUsers = useCallback(async () => {
    const response = await axios({
      url: 'http://0.0.0.0:8000/users/',
      method: 'get'
    });
    return response;
  }, []);

  const addUser = async (body: {
    name: string;
    email: string;
    age: string | number;
  }) => {
    const response = await axios.post('http://0.0.0.0:8000/users/', body);
    if (response.status == 201) {
      const { data } = await getUsers();
      setUsersData(data);
    }
  };

  const deleteUser = async (user_id: number) => {
    const response = await axios.delete(`http://0.0.0.0:8000/users/${user_id}`);
    if (response.status === 204) {
      const { data } = await getUsers();
      setUsersData(data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getUsers();
        setUsersData(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, [getUsers]);

  return (
    <>
      <div className='main-container'>
        <div className='button'>
          <Button variant='solid' onClick={onDialogSwitch}>
            Add User
          </Button>
        </div>
        {isOpen && (
          <AddUser
            addUser={addUser}
            isOpen={isOpen}
            onDialogSwitch={onDialogSwitch}
          />
        )}
        <div className='table'>
          {usersData.length ? (
            <UserDataTable users={usersData} deleteUser={deleteUser} />
          ) : (
            <div>
              There's no user data available as of now. click on add user to add
              new user data
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
