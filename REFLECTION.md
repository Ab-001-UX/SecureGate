# SecureGate - Reflection & Engineering Analysis
**Name:** Abimbola Monsurat
**Cohort:** Design to MVP Bootcamp
**Live URL:** https://secure-gate-b0aksbepu-ab-001-uxs-projects.vercel.app
**GitHub Repo:** https://github.com/Ab-001-UX/SecureGate.git

---

## Part 1 - What I Built
I built SecureGate, which is basically a secure front door for websites to make sure only verified users can get in. I set up a register page that securely scrambles passwords, a login page that stops hackers from guessing too many times, and a system that sends emails to verify the user's account. I also made sure that if you try to visit the dashboard without logging in, the site blocks you and sends you back to the sign-in screen.

## Part 2 - What Surprised Me
I was really surprised by how hard it was to make the login page show the exact error when someone typed the wrong password or didn't check their email. The tool I used for logging in, NextAuth, kept swallowing my specific error messages and just showing a generic error. I had to read up on how NextAuth works behind the scenes and write a special workaround using callbacks to bypass this, which taught me that helper tools can sometimes make simple things surprisingly tricky.

## Part 3 - Engineering Laws Quiz

### Q1 - Murphy's Law
**Code reference:** [rate-limiter.ts](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/lib/rate-limiter.ts#L57-L64) and [route.ts](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/app/api/auth/register/route.ts#L69-L83)
**My Answer:** In my login system, I prepared for things breaking down. For example, my login system uses a speed-limiter tool to stop hackers. If that tool crashes, my code catches the error and lets normal users log in anyway so they are not locked out. Also, when signing up, the system creates the user profile and the email check token at the exact same time. If the database crashes halfway through, the system cancels the whole thing so we do not get stuck with broken, half-created accounts.
**What goes wrong if ignored:** If I did not set this up, a simple network glitch or a database crash could either lock all users out of the website completely, or leave a bunch of broken, unusable user profiles in my database that can never be verified.

### Q2 - Law of Leaky Abstractions
**Code reference:** [auth.ts](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/lib/auth.ts#L25-L56) and [page.tsx](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/app/auth/login/page.tsx#L62-L73)
**My Answer:** A helper tool is supposed to make building features easy by hiding all the complex steps, but sometimes that tool behaves weirdly, forcing you to look inside it to fix a problem. I ran into this with NextAuth when trying to show specific errors. Since it kept hiding my messages and giving a generic error, I had to write a workaround that returns a custom error object, catches it inside a signIn callback, and throws it to the login screen.
**What goes wrong if ignored:** If I ignored this, the website would only show a generic "Authentication failed" alert. Users would have no idea if they typed the wrong password, if the email was never registered, or if they need to check their inbox to verify their email.

### Q3 - YAGNI (You Aren't Gonna Need It)
**Code reference:** [package.json](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/package.json#L14-L26)
**My Answer:** I should not build extra features before I actually need them, otherwise I will waste time and make the system messy. My app does not have social media logins like Google or Facebook, and it does not have fingerprint scanning. Keeping the package file minimal saved me time and kept the code clean and fast.
**What goes wrong if ignored:** If I tried to add every login feature possible right now, the codebase would become super complex, the website would load slower, and I would spend all my time fixing bugs on features that nobody is even using yet.

### Q4 - Password Hashing & Kerckhoffs's Principle
**Code reference:** [route.ts](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/app/api/auth/register/route.ts#L61-L62)
**My Answer:** The security of my system should not rely on keeping my code secret. Instead, it relies on scrambling passwords using a slow mathematical formula called bcrypt. Even if a hacker downloads my entire code and database, they cannot read the passwords. I also add random noise called a salt so that if two users share the same password, their scrambled results look totally different. I used a slow formula because fast formulas let hackers guess millions of passwords per second using cheap computers.
**What goes wrong if ignored:** If I ignored this and stored plain passwords, or used a fast scrambler, anyone who gains access to the database could immediately read every user's password and compromise all accounts instantly.

### Q5 - Postel's Law / Security by Design
**Code reference:** [route.ts](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/app/api/auth/forgot-password/route.ts#L41-L51)
**My Answer:** When designing a security screen, you have to be careful about what information you give away. On my password-reset page, if someone enters an email address that does not exist in my system, I do not tell them the email is missing. Instead, I show the exact same success response as a valid email and add a tiny random delay to simulate a real check. This stops hackers from testing a list of emails to spy on who has an account.
**What goes wrong if ignored:** If I told the user "this email is not in our system," a hacker could run a script with a list of leaked emails to find out exactly who has an account on my website, violating their privacy.

### Q6 - The Boy Scout Rule
**Code reference:** [sign-out-button.tsx](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/components/sign-out-button.tsx#L7-L23)
**My Answer:** I should always leave the code cleaner than I found it. While editing my sign-out button, I noticed it had a hardcoded identification label. Having duplicate labels on a single page breaks web rules and confuses screen readers. I fixed this by refactoring the button so that whichever page uses it can pass in its own custom labels and styling options.
**What goes wrong if ignored:** Leaving duplicate IDs in code makes the website harder to maintain and breaks accessibility rules, causing test suites or screen readers to fail when loading pages.

### Q7 - Gall's Law
**Code reference:** [schema.prisma](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/prisma/schema.prisma)
**My Answer:** A working complex system is always built by starting with a simple system and adding to it. I did not try to build logins, email checks, and speed-limiters all at once. I started with a simple user schema and verified logins worked. Once that was stable, I added database support for tokens, then email notifications, and finally the rate-limiter.
**What goes wrong if ignored:** Trying to design the entire security system all at once would result in too many bugs at the same time, making it almost impossible to figure out what is broken.

### Q8 - Database Schema vs. Model Struct (ORM Leakage)
**Code reference:** [schema.prisma](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/prisma/schema.prisma#L11)
**My Answer:** The database helper I use (Prisma) has a slightly different way of doing things compared to the actual database software. My schema says the database should automatically generate a unique ID string for every new user. However, this ID is actually generated by my Node.js application code just before it sends the user data to the database. The database itself does not generate it.
**What goes wrong if ignored:** If I try to insert a user directly into the database without using the helper code, the database will throw an error and fail because it expects the ID to be provided by the application.

### Q9 - Zawinski's Law
**Code reference:** [rate-limiter.ts](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/lib/rate-limiter.ts)
**My Answer:** Software tends to expand and get bloated if you keep adding features in the same place. Since NextAuth does not limit login attempts automatically, I had to build a speed-limiter. To keep the project clean, I put this logic into its own separate file instead of mixing it into the main login routes, keeping the core code easy to read.
**What goes wrong if ignored:** Mixing different features like email, rate-limiting, and credentials together in one file makes the code super messy, making it extremely hard to find and fix bugs later on.

### Q10 - Error Messages & The Principle of Least Surprise
**Code reference:** [page.tsx](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/app/auth/login/page.tsx#L24-L36)
**My Answer:** The website should behave in a way that makes sense to normal users. When a user makes a mistake typing their email, they expect to be told that the email is incorrect, rather than getting a generic "Auth Error." I split the generic error into specific messages to avoid confusing the user, choosing a helpful user experience over strict security.
**What goes wrong if ignored:** Users will get frustrated and locked out because they will have no idea why the site is rejecting their credentials, leading to bad user feedback.

### Q11 - Dashboard Route Protection & Cookie Deletion
**Code reference:** [middleware.ts](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/middleware.ts#L4-L17)
**My Answer:** When a user logs in, their browser stores a secret ticket called a cookie. The system middleware checks this cookie before letting anyone view the dashboard. If a user deletes this cookie or logs out, the gatekeeper code immediately redirects them back to the login screen.
**What goes wrong if ignored:** Anyone could bypass the login screen and view private dashboard layouts simply by typing the dashboard URL into their browser address bar.

### Q12 - Leaked Secrets & Rotation
**Code reference:** [.env](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/.env#L5)
**My Answer:** If the master password for my session security is accidentally published online, anyone can copy it to forge login credentials and access user accounts. To fix this, I would immediately change the master password in my server settings, which automatically logs everyone out. I would then use history cleaning tools to erase the leaked key from my repository history.
**What goes wrong if ignored:** Hackers could use the leaked key to generate valid login cookies for any user account, letting them log in as administrators or normal users without needing any passwords.

### Q13 - Conway's Law
**Code reference:** [page.tsx](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/app/auth/login/page.tsx) and [route.ts](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/app/api/auth/register/route.ts)
**My Answer:** The structure of a codebase naturally reflects the team structure of the people who build it. The files in my app group the layout views and the backend data handlers together in the same folders. This matches my workflow as a full-stack developer who designs and builds complete features from start to finish, rather than separating the work into isolated frontend and backend teams.
**What goes wrong if ignored:** Forcing a folder structure that separates frontend and backend files completely would slow me down and make it annoying to navigate since I am building the whole feature by myself.

### Q14 - Technical Debt Identification
**Code reference:** [email.ts](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/lib/email.ts#L11-L23)
**My Answer:** I left some code in a temporary state that is messy and will cause issues when I want to update it later. Right now, the HTML designs of my emails are hardcoded directly inside my sending functions. This makes it difficult to change the look or wording of emails without risking breaking the sending code. I can clean this up by moving the HTML designs into a separate templates file.
**What goes wrong if ignored:** If I need to change a spelling mistake or design in an email, I have to open the core sending file, increasing the risk of introducing a typo that breaks the entire email delivery system.

### Q15 - Flutterwave Payment Integration Synthesis
**Code reference:** [schema.prisma](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/prisma/schema.prisma#L10-L17)
**My Answer:** If I wanted to add a payment system, I would need to apply all these design rules. I must use transactions so a user is only marked as paid if the money actually goes through. I must verify transaction IDs to make sure no one is billed twice for the same click. I must keep the payment keys secret, and I must build the payment system in simple steps, starting by logging payments before locking features.
**What goes wrong if ignored:** Without these checks, users could upgrade their accounts without paying, get double-billed, or experience account errors where they pay but their status never updates.

---

## Part 4 - One Thing I Would Refactor
Right now, the HTML email layouts are hardcoded directly inside the sending functions (`sendVerificationEmail` and `sendPasswordResetEmail`) in `src/lib/email.ts#L11-L23`. This is messy technical debt. I want to separate the email layouts from the sending functions. By putting the HTML templates in their own file `src/lib/email-templates.ts`, I can edit how emails look without risking breaking the code that actually connects to the email server.

Here is the refactored version:

**New File [email-templates.ts](file:///c:/Users/MONSURAT/OneDrive/Desktop/SecureGate/src/lib/email-templates.ts)**
```typescript
export function getVerificationEmailHtml(url: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a; margin-bottom: 16px;">Verify your SecureGate Account</h2>
      <p style="color: #475569; font-size: 16px; line-height: 24px;">Please click the button below to confirm your email address and authorize your portal access.</p>
      <div style="margin: 24px 0;">
        <a href="${url}" style="background-color: #020617; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; display: inline-block;">Verify Email</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">This link will expire in 24 hours.</p>
    </div>
  `;
}

export function getResetPasswordEmailHtml(url: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a; margin-bottom: 16px;">Reset Password Requested</h2>
      <p style="color: #475569; font-size: 16px; line-height: 24px;">Click the button below to update your SecureGate password.</p>
      <div style="margin: 24px 0;">
        <a href="${url}" style="background-color: #020617; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">This link will expire in 1 hour.</p>
    </div>
  `;
}
```

## Part 5 - How This Changes How I Build
Building SecureGate changed how I write code by making me think about security and edge cases before I even start typing. I learned that coding user sign-ins isn't just about storing credentials; you have to plan for what happens when servers crash, how to slow down hackers, and how to verify emails securely. Understanding how NextAuth works behind the scenes also taught me to look closely at third-party helper libraries so that I can handle custom errors instead of just accepting their default settings.
