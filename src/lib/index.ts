import { Client, Account } from 'matej-appwrite';

const client = new Client();

client.setEndpoint('https://team-auth-features.appwrite.org/v1').setProject('fountain-of-youth'); // Replace with your project ID

export const account = new Account(client);
