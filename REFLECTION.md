# SecureGate - Reflection & Engineering Analysis
**Name:** Abimbola Monsurat
**Cohort:** Design to MVP Bootcamp
**Live URL:** [Your Vercel deployment link]
**GitHub Repo:** https://github.com/Ab-001-UX/SecureGate.git

---

### **01. Murphy's Law**
If things can go wrong, they will. In my login system, I had to prepare for when parts of the internet crash. For example, my login system uses a speed-limiter service to stop hackers. If that speed-limiter breaks down, I made sure the login page keeps working so normal users are not locked out. Also, during signup, my system creates the user profile and generates an email check key at the exact same time. If the database fails halfway through, the system cancels everything so we do not get stuck with broken, half-created accounts.

For the speed-limiter helper, see [src/lib/rate-limiter.ts](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/lib/rate-limiter.ts#L42-L49).
For the signup transaction, see [src/app/api/auth/register/route.ts](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/app/api/auth/register/route.ts#L69-L83).

---

### **02. The Law of Leaky Abstractions**
A helper tool makes building things easy by hiding complex steps, but sometimes that tool behaves weirdly, forcing you to look inside it to fix a problem. I ran into this with the tool that handles my user sessions. When I wanted to show a specific message like "Wrong password", the tool hid the real error and sent back a generic message. I had to write code to catch and translate that hidden message so the user gets a helpful alert.

For the session tool handler, see [src/lib/auth.ts](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/lib/auth.ts#L43-L56).
For the login alert translator, see [src/app/auth/login/page.tsx](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/app/auth/login/page.tsx#L62-L73).

---

### **03. YAGNI (You Aren't Gonna Need It)**
I should not build extra features before I actually need them, otherwise I will waste time and make the system messy. My app does not have social media logins or fingerprint scanning right now. Keeping it simple saved me time and kept the system clean. If I need to add those later, I can easily modify my user profile layout and add a secondary login screen.

For the basic settings list, see [package.json](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/package.json#L13-L25).

---

### **04. Password Hashing & Kerckhoffs's Principle**
The security of my system should not rely on keeping my code a secret. Instead, it relies on a lock that cannot be broken even if the thief knows how the lock works. I protect passwords by scrambling them using a slow mathematical formula. A salt is random noise added to the password so that if two users share the same password, their scrambled results look totally different. I avoid fast scrambling formulas because hackers can use computers to guess millions of passwords per second. My slow formula prevents this by making guesses take too much time and power.

For the scrambling code, see [src/app/api/auth/register/route.ts](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/app/api/auth/register/route.ts#L61-L62).

---

### **05. Postel's Law / Security by Design**
When designing a security screen, I must be careful about what information I send back. On my password-reset page, if someone enters an email address that does not exist in my system, I do not tell them the email is missing. Instead, I show a generic message saying a link was sent. I also added a tiny random delay to simulate a real check. This stops hackers from testing list after list of emails to spy on who has an account on my website.

For the check logic and delay, see [src/app/api/auth/forgot-password/route.ts](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/app/api/auth/forgot-password/route.ts#L41-L51).

---

### **06. The Boy Scout Rule**
I should always leave the code cleaner than I found it. While editing my main landing page buttons, I noticed that the sign-out button had a hardcoded identification label. Having duplicate labels on a single page breaks web rules and confuses testing tools. I fixed this by refactoring the button so it can accept custom labels from whatever page uses it.

For the refactored button, see [src/components/sign-out-button.tsx](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/components/sign-out-button.tsx#L7-L23).

---

### **07. Gall's Law**
A working complex system is always built by starting with a working simple system and adding to it. I did not try to build logins, email verifications, expirations, and blockers all at once. I started with a simple login form. Once that worked, I added database support for tokens, then the email notification code, and finally the speed-limiter.

For the database models evolution, see [prisma/schema.prisma](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/prisma/schema.prisma).

---

### **08. Database Schema vs. Model Struct (ORM Leakage)**
The database helper I use in my code has a slightly different way of looking at things compared to the actual database software itself. For example, my code says the database should automatically generate a unique ID string for every new user. However, this ID is actually generated by my application code just before it sends the user data to the database. The database itself does not know how to generate this ID. If I try to insert a user directly without using my code helper, the database will throw an error and fail.

For the user ID schema definition, see [prisma/schema.prisma](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/prisma/schema.prisma#L11).

---

### **09. Zawinski's Law**
Software tends to get bloated and messy if you keep piling new features into the same place. Since the login tool I use does not limit user attempts automatically, I had to build my own speed-limiter. To keep the project clean, I put this logic into its own separate file instead of mixing it into the main login routes. This keeps the core files clean and easy to read.

For the isolated speed-limiter code, see [src/lib/rate-limiter.ts](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/lib/rate-limiter.ts).

---

### **10. Error Messages & The Principle of Least Surprise**
The website should behave in a way that makes sense to normal users. When a user makes a mistake typing their email, they expect to be told that the email is incorrect, rather than getting a generic error message. I split the generic error into specific messages to avoid confusing the user, choosing a helpful user experience over strict security.

For the login page message checks, see [src/app/auth/login/page.tsx](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/app/auth/login/page.tsx#L24-L36).

---

### **11. Dashboard Route Protection & Cookie Deletion**
When a user logs in, their browser stores a secret ticket called a cookie. The system middleware checks this cookie before letting anyone view the dashboard. If a user deletes this cookie, the gatekeeper code immediately notices that the ticket is missing and redirects them back to the login screen.

The user tries to load the dashboard, which triggers the check in [src/middleware.ts](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/middleware.ts#L4-L17).

---

### **12. Leaked Secrets & Rotation**
If the master password for my session security is accidentally published online, anyone can copy it to forge login credentials and access my user data. To fix this, I would immediately change the master password in my server settings, which automatically logs everyone out. I would then use history cleaning tools to erase the leaked key from my online code repository.

For the secret configuration location, see [.env](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/.env#L5).

---

### **13. Conway's Law**
The structure of a codebase naturally reflects the team structure of the people who build it. The files in my app group the layout views and the backend data handlers together in the same folders. This matches my workflow as a full-stack developer who designs and builds complete features from start to finish, rather than separating the work into isolated frontend and backend teams.

For the login page layout, see [src/app/auth/login/page.tsx](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/app/auth/login/page.tsx).
For the signup server handler, see [src/app/api/auth/register/route.ts](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/app/api/auth/register/route.ts).

---

### **14. Technical Debt Identification**
I left some code in a temporary state that is messy and will cause issues when I want to update it later. Right now, the HTML designs of my emails are hardcoded directly inside my sending functions. This makes it difficult to change the look or wording of emails without risking breaking the sending code. I can clean this up by moving the HTML designs into a separate templates file.

For the hardcoded email designs, see [src/lib/email.ts](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/src/lib/email.ts#L11-L23).

---

### **15. Flutterwave Payment Integration Synthesis**
If I wanted to add a payment system, I would need to apply all these design rules. I must use transactions so a user is only marked as paid if the money actually goes through. I must verify transaction IDs to make sure no one is billed twice for the same click. I must keep the payment keys secret, and I must build the payment system in simple steps, starting by logging payments before locking features.

For the database subscription layout, see [prisma/schema.prisma](file:///c:/Users/Monsurat/OneDrive/Desktop/SecureGate/prisma/schema.prisma#L10-L17).
