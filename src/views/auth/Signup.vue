<script setup>
</script>

<template>
  <div class="sign">
    <div class="signin">
      <div class="stars"></div>
      <h2 class="signin-left">Create your free account</h2>
      <p>Explore TechTought core features for individuals and organizations.</p>
    </div>

    <div class="signin-right">
      <h4 class="already-have-account">
        Already have an account? <a href="">Sign in →</a>
      </h4>
      <h2 class="sig">Sign up for TechTought</h2>

      <form class="form-container">
        <div class="form-group">
          <label>Full Name*</label>
          <input type="text" placeholder="Your work email" />
        </div>

        <div class="form-group">
          <label>Email*</label>
          <input type="email" placeholder="Your work email" />
        </div>

        <div class="form-group">
          <label>Password*</label>
          <input
            type="password"
            placeholder="Must be at least 8 characters."
          />
        </div>

        <div class="form-group">
          <label>Confirm Password*</label>
          <input type="password" placeholder="Your work email" />
        </div>

        <div class="form-group">
          <label>Your Country/Region*</label>
          <select>
            <option value="usa">United States of America</option>
            <option value="eg">Egypt</option>
            <option value="canada">Canada</option>
            <option value="almania">Germany</option>
            <option value="saudi">Saudi Arabia</option>
            <option value="italia">Italy</option>
          </select>
        </div>

        <div class="checkbox-group">
          <h5>Email preferences</h5>
          <label class="checkbox-label">
            <input type="checkbox" name="subscribe" value="newsletter" />
            Receive occasional product updates and announcements.
          </label>
        </div>

        <button type="submit" class="submit-btn">Create account</button>

        <div class="terms">
          <p>
            By creating an account, you agree to the
            <a href="">Terms of Service.</a> For more information about
            GitHub's privacy practices, see the
            <a href="">GitHub Privacy Statement</a>. We'll occasionally send
            you account-related emails.
          </p>
        </div>
      </form>
      <div class="logo">
      <ul>
        <li><img src="C:\Users\WiN_11\OneDrive\Desktop\techtought-frontend\twi.jpg"></li>
        <li><img src="C:\Users\WiN_11\OneDrive\Desktop\techtought-frontend\img.jpg"></li>
        <li><img src="C:\Users\WiN_11\OneDrive\Desktop\techtought-frontend\tel.jpg"></li>
     </ul>
    </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.sign {
  display: flex;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif;
}

.signin {
  background: radial-gradient(
    circle at bottom,
    #61DAFB -150%,
    #020103 70%,
    #020103 10%
  );
  color: white;
  padding: 80px 15px;
  width: 50%;

  position: relative;
  overflow: hidden;
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.stars::before,
.stars::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 
    20px 40px 0 0 white,
    80px 100px 0 0 white,
    150px 60px 0 0 white,
    300px 150px 0 0 white,
    250px 50px 0 0 white,
    100px 200px 0 0 white,
    350px 250px 0 0 white,
    180px 180px 0 0 white,
    280px 80px 0 0 white,
    50px 300px 0 0 white,
    320px 350px 0 0 white,
    200px 120px 0 0 white,
    400px 200px 0 0 white,
    120px 400px 0 0 white,
    380px 450px 0 0 white,
    220px 320px 0 0 white,
    340px 180px 0 0 white,
    90px 150px 0 0 white,
    270px 420px 0 0 white,
    160px 280px 0 0 white,
    410px 320px 0 0 white,
    60px 500px 0 0 white,
    310px 520px 0 0 white,
    190px 460px 0 0 white,
    420px 100px 0 0 white,
    140px 50px 0 0 rgba(255, 255, 255, 0.5),
    360px 400px 0 0 rgba(255, 255, 255, 0.5),
    240px 240px 0 0 rgba(255, 255, 255, 0.5),
    70px 380px 0 0 rgba(255, 255, 255, 0.5),
    390px 280px 0 0 rgba(255, 255, 255, 0.5);
  animation: twinkle 3s infinite alternate;
}

.stars::after {
  width: 1px;
  height: 1px;
  box-shadow: 
    40px 80px 0 0 rgba(255, 255, 255, 0.6),
    120px 140px 0 0 rgba(255, 255, 255, 0.6),
    200px 90px 0 0 rgba(255, 255, 255, 0.6),
    330px 190px 0 0 rgba(255, 255, 255, 0.6),
    280px 120px 0 0 rgba(255, 255, 255, 0.6),
    130px 250px 0 0 rgba(255, 255, 255, 0.6),
    370px 300px 0 0 rgba(255, 255, 255, 0.6),
    210px 210px 0 0 rgba(255, 255, 255, 0.6),
    300px 110px 0 0 rgba(255, 255, 255, 0.6),
    80px 330px 0 0 rgba(255, 255, 255, 0.6),
    340px 380px 0 0 rgba(255, 255, 255, 0.6),
    230px 150px 0 0 rgba(255, 255, 255, 0.6),
    430px 230px 0 0 rgba(255, 255, 255, 0.6),
    150px 430px 0 0 rgba(255, 255, 255, 0.6),
    400px 480px 0 0 rgba(255, 255, 255, 0.6),
    250px 350px 0 0 rgba(255, 255, 255, 0.6);
  animation: twinkle 4s infinite alternate-reverse;
}

@keyframes twinkle {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.4;
  }
}

.signin-left {
  font-size: 48px;
  font-weight: 300;
  margin-bottom: 20px;
  line-height: 1.25;
  letter-spacing: -0.5px;
  position: relative;
  z-index: 1;
}

.signin p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  position: relative;
  z-index: 1;
}

.signin-right {
  width: 50%;
  padding: 40px 80px;
  background-color: #f6f8fa;
  overflow-y: auto;
}

.already-have-account {
  text-align: right;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 40px;
  color: #57606a;
}

.already-have-account a {
  color: #0969da;
  text-decoration: none;
  font-weight: 500;
}

.already-have-account a:hover {
  text-decoration: underline;
}

.sig {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #1f2328;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #1f2328;
}

.form-group input,
.form-group select {
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid #d0d7de;
  font-size: 14px;
  background-color: white;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #0969da;
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
}

.form-group input::placeholder {
  color: #6e7781;
}

.form-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%236e7781' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 40px;
}

.checkbox-group {
  margin-top: 8px;
}

.checkbox-group h5 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2328;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: #1f2328;
  cursor: pointer;
  line-height: 1.5;
}

.checkbox-label input[type='checkbox'] {
  margin-top: 3px;
  cursor: pointer;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.submit-btn {
  width: 100%;
  background-color: #12141A;
  color: white;
  height: 48px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #2A2C36;
}

.submit-btn:active {
  background-color: #2A2C36;
}

.terms {
  margin-top: 8px;
}

.terms p {
  font-size: 12px;
  color: #57606a;
  line-height: 1.6;
}

.terms a {
  color: #0969da;
  text-decoration: none;
}

.terms a:hover {
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .signin-right {
    padding: 40px 50px;
  }
  
  .signin {
    padding: 60px 40px;
  }
}

@media (max-width: 768px) {
  .sign {
    flex-direction: column;
  }

  .signin,
  .signin-right {
    width: 100%;
  }

  .signin {
    min-height: 300px;
    padding: 40px 30px;
  }

  .signin-left {
    font-size: 36px;
  }

  .signin-right {
    padding: 30px;
  }
}
.logo{
    justify-content: center;
    text-align: center;
    align-items: center;
    display: flex;
    padding: 130px;
}
.logo li{
    list-style: none;
}
.logo ul{
    display: flex;
    gap: 20px;
}
</style>