import {Account, Avatars, Client, Databases, ID, Query} from "react-native-appwrite"
import {CreateUserParams, GetMenuParams, SignInParams, User} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: "com.bentang.foodordering",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: '688672cc00218720bf12',
    userCollectionId: '688672fe003c15c03dcc'
}

export const client = new Client();

client.
    setEndpoint(appwriteConfig.endpoint).
    setProject(appwriteConfig.projectId).
    setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);

const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if (!newAccount) throw new Error;

        
        await signIn({ email, password});

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { accountId: newAccount.$id, email, name, avatar: avatarUrl
            }
        );

    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error("No account found");

        const currentUser = await databases.listDocuments<User>(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser || currentUser.total === 0) return null;

        return currentUser.documents[0]; // now inferred as User
    } catch (e) {
        console.error("getCurrentUser error", e);
        return null;
    }
};