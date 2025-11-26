const bcrypt = require('bcrypt');

// This is the password you're trying during login
const enteredPassword = 'password123';

// This is the hashed password from your MongoDB user
const storedHashedPassword = '$2b$10$FQF/y6PLcZf33iZk9vXoTeoKYvbQzvLmqRxyE1xGcIEzyuww3ZEYO';

bcrypt.compare(enteredPassword, storedHashedPassword, (err, result) => {
  if (err) throw err;
  console.log('✅ Password Match:', result);
});