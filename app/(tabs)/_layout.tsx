import { View, Text, Image } from 'react-native'
import React from 'react'
import { Redirect, Slot, Tabs } from 'expo-router'
import useAuthStore from '@/store/auth.store'
import { TabBarIconProps } from '@/type'
import { images } from '@/constants'
import cn from 'clsx'

const TabBarIcon = ({ focused, icon, title}: TabBarIconProps) => (
    <View className="tab-icon">
        <Image source={icon} className="size-7" resizeMode="contain" tintColor={focused ? '#fE8C00' : '#5D5F6D'} />
        <Text className={cn('text-sm font-bold', focused ? 'text-primary' : 'text-gray-200')}>
            {title}
        </Text>
    </View>
)

export default function TabLayout() {
    const {isAuthenticated } = useAuthStore();
    if (!isAuthenticated) return <Redirect href="/sign-in" />
  return (
    <Tabs
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50,
                marginHorizontal: 20,
                height: 80,
                position: 'absolute',
                bottom: 40,
                backgroundColor: 'white',
                shadowColor: '#1a1a1a',
                shadowOffset: {width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,

            }
        }}
    >

        <Tabs.Screen 
            name="index"
            options={{
                title: 'Home',
                tabBarIcon: ({focused }) => <TabBarIcon focused={focused} title="Home" icon={images.home} />
            }}
        />
        <Tabs.Screen 
            name="search"
            options={{
                title: 'Search',
                tabBarIcon: ({focused }) => <TabBarIcon focused={focused} title="Search" icon={images.search} />
            }}
        />
        <Tabs.Screen 
            name="cart"
            options={{
                title: 'Cart',
                tabBarIcon: ({focused }) => <TabBarIcon focused={focused} title="Cart" icon={images.bag} />
            }}
        />
        <Tabs.Screen 
            name="profile"
            options={{
                title: 'Profile',
                tabBarIcon: ({focused }) => <TabBarIcon focused={focused} title="Profile" icon={images.person} />
            }}
        />
    </Tabs>
  )
}