import { Button } from '@mui/joy';
import Table from '@mui/joy/Table';

const UserDataTable = ({
  users,
  deleteUser,
}: {
  users: {
    name: string;
    email: string;
    age: string | number;
    id: string | number;
  }[],
  deleteUser: (user_id: number) => void
}) => {
  return (
    <Table aria-label='basic table' variant='outlined'>
      <thead>
        <tr>
          <th>Sr. no</th>
          <th>Name</th>
          <th>email</th>
          <th>Age</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr style={{
            textAlign: 'left'
          }}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.age}</td>
            <td>
              <div style={{ display: 'flex', gap: '8px'}}>
                <Button color='danger' variant='soft' onClick={() => deleteUser(Number(user.id))}>Delete</Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserDataTable;
