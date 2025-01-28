import simpleGit from 'simple-git';
import { config } from 'dotenv';

config();
const git = simpleGit();

(async () => {
  try {
    // Check if remote already exists
    const remotes = await git.getRemotes(true);
    const originExists = remotes.some(remote => remote.name === 'origin');

    if (!originExists) {
      // Initialize Git and add remote if it doesn't exist
      console.log('Adding remote "origin".');
      await git.init();
      await git.addRemote('origin', process.env.GIT_REPO);
      await git.addConfig('user.name', 'AI Book Team');
      await git.addConfig('user.email', 'ai-book@example.com');
    } else {
      console.log('Remote "origin" already exists. Skipping setup.');
    }

    // Fetch all branches from the remote
    await git.fetch();

    // Check if the "main" branch exists on the remote
    const remoteBranches = await git.branch(['-r']);
    if (!remoteBranches.all.includes('origin/main')) {
      console.log('Remote branch "main" does not exist. Creating "main".');
      await git.checkoutLocalBranch('main'); // Create a local "main" branch if it doesn't exist
      await git.push(['-u', 'origin', 'main']); // Push the new "main" branch to the remote
    } else {
      console.log('Remote branch "main" exists. Checking it out.');
      await git.checkout('main'); // Switch to the "main" branch
    }

    console.log('Git setup completed successfully.');
  } catch (error) {
    console.error('Git setup error:', error.message);
  }
})();
