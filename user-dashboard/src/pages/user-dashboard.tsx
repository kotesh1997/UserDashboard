import { Button } from '@mui/joy';
import './userDashboard.css';
import { useState } from 'react';
import AddUser from '../components/add-user';
import UserDataTable from '../components/user-table';

const UserDashboard = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onDialogSwitch = () => setIsOpen((open) => !open);

  return (
    <>
      <div className='main-container'>
        <div className='button'>
          <Button variant='solid' onClick={onDialogSwitch}>
            Add User
          </Button>
        </div>
        {isOpen && <AddUser isOpen={isOpen} onDialogSwitch={onDialogSwitch} />}
        <div className='table'>
          <UserDataTable />
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
