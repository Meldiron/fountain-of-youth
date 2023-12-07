import { Client, Functions } from 'appwrite';

const client = new Client();

client.setEndpoint('https://cloud.appwrite.io/v1').setProject('fountain-of-youth-ssr'); // Replace with your project ID

export const functions = new Functions(client);
