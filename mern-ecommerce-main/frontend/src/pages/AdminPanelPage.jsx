import React from 'react'
import { Navbar } from '../features/navigation/components/Navbar'
import { AdminPanel } from '../features/admin/components/adminPanel'

export const AdminPanelPage = () => {
  return (
    <>
    <Navbar isProductList={true}/>
    <AdminPanel/>
    </>
  )
}
