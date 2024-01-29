import { useEffect, useRef, useState } from "react";
import { Pill } from "./components/Pill";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [uniqueSelectedUsers, setUniqueSelectedUsers] = useState(new Set());
  const [focusedListItem, setFocusedListItem] = useState(0);

  const inputRef = useRef();
  const listRef = useRef();

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchTerm("");
    setUniqueSelectedUsers(new Set([...uniqueSelectedUsers, user.email]));
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleRemoveUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    const updatedEmails = new Set([...uniqueSelectedUsers]);
    updatedEmails.delete(user.email);
    setUniqueSelectedUsers(updatedEmails);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 40) {
      if (focusedListItem === suggestions.length) return;
      moveFocusDown();
    }

    if (e.keyCode === 38) {
      if (focusedListItem === 0) return;
      moveFocusUp();
    }

    if (
      e.key === "Backspace" &&
      selectedUsers.length > 0 &&
      e.target.value === ""
    ) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    }
  };

  const moveFocusDown = () => {
    if (focusedListItem !== null && focusedListItem < suggestions.length - 1) {
      const newFocusedListItem = focusedListItem + 1;
      setFocusedListItem(newFocusedListItem);
    }
  };

  const moveFocusUp = () => {
    if (focusedListItem !== null && focusedListItem > 0) {
      const newFocusedListItem = focusedListItem - 1;
      setFocusedListItem(newFocusedListItem);
    }
  };

  useEffect(() => {
    (function () {
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }

      fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
        .then((res) => res.json())
        .then((res) => setSuggestions(res.users))
        .catch((err) => console.log(err));
    })();
  }, [searchTerm]);

  return (
    <div>
      <div className="user-search-container">
        <div className="user-search-input">
          {/* Pills */}
          {selectedUsers?.map((user) => (
            <Pill
              key={user.email}
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
              onClick={() => handleRemoveUser(user)}
            />
          ))}
          {/* input field with search suggestions */}
          <div>
            <input
              type="text"
              value={searchTerm}
              placeholder="Search for a user..."
              ref={inputRef}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {/* Search Suggestions */}
            <ul className="suggestions-list" ref={listRef}>
              {suggestions?.map((user, index) => {
                return !uniqueSelectedUsers.has(user.email) ? (
                  <li
                    key={user.email}
                    onClick={() => handleSelectUser(user)}
                    style={{
                      backgroundColor:
                        focusedListItem === index ? "lightblue" : "white",
                    }}
                  >
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <span>
                      {user.firstName}
                      {user.lastName}
                    </span>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
