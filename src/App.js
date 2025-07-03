import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Jeff',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Jeremiah',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowFriend() {
    setShowAddFriend(show => !show);
  }

  function handleAddFriend(newFriend) {
    setFriends(friends => [...friends, newFriend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend(curr => (curr?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplit(value) {
    setFriends(friends =>
      friends.map(friend =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAdd handleAddFriend={handleAddFriend} />}

        <Button onClick={handleShowFriend}>
          {showAddFriend ? 'Close' : 'Add Friend'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleSplit={handleSplit}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, handleSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map(friend => (
        <Friend
          friend={friend}
          key={friend.id}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} Owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => handleSelection(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAdd({ handleAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };

    handleAddFriend(newFriend);
    setName('');
    setImage('https://i.pravatar.cc/48');
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />

      <label> Image URL</label>
      <input
        type="text"
        value={image}
        onChange={e => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, handleSplit }) {
  const [bill, setBill] = useState('');
  const [userPay, setUserPay] = useState('');
  const paidByFriend = bill ? bill - userPay : '';
  const [whoIsPaying, setWhoIsPaying] = useState('user');

  function handleForm(e) {
    e.preventDefault();

    if (!bill || !userPay) return;
    handleSplit(whoIsPaying === 'user' ? paidByFriend : -userPay);
  }

  return (
    <form className="form-split-bill" onSubmit={handleForm}>
      <h2>Split a bill {selectedFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={e => setBill(Number(e.target.value))}
      />

      <label>Your Expense</label>
      <input
        type="text"
        value={userPay}
        onChange={e =>
          setUserPay(
            Number(e.target.value) > bill ? userPay : Number(e.target.value)
          )
        }
      />

      <label>{selectedFriend.name}'s Expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>Who's paying</label>
      <select
        value={whoIsPaying}
        onChange={e => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
