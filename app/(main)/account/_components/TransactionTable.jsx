"use client"
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns';
import React from 'react'

function TransactionTable({transactions}) {
const filteredAndSortedTransactions = transactions;
const handleSort = () =>
{
}

  return (
    <div className='space-y-4'>
      {/*Filters */}
      {/*Transactions */}
      <div className='rounded-md-border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox/>
              </TableHead>
              <TableHead 
                className="w-[50px]"
                onClick = {() => handleSort("date")}> <div className='flex items-center'>Date</div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead 
                className="w-[50px]"
                onClick = {() => handleSort("category")}><div className='flex items-center'>Category</div>
              </TableHead>
              <TableHead 
                className="w-[50px]"
                onClick = {() => handleSort("amount")}><div className='flex items-center justify-end'>Amount</div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]"></TableHead>


            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan = {7} className="text-center text-muted-foreground">
                  No Transaction Found
                </TableCell>
              </TableRow>
            ):(
              filteredAndSortedTransactions.map((transactions)=>(
                <TableRow key = {transactions.id}>
                <TableCell><Checkbox/></TableCell>
                <TableCell>{format(new Date(transactions.date), "PP")}</TableCell>
                <TableCell>{transactions.description}</TableCell>
                <TableCell>{transactions.category}</TableCell>

                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TransactionTable