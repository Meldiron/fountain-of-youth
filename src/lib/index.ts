import { Client, Account } from 'matej-appwrite';

const client = new Client();

client.setEndpoint('http://localhost/v1').setProject('65703bacf1d213206ec5'); // Replace with your project ID

export const account = new Account(client);
