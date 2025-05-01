"use client"
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns';
import React, { useReducer, useState } from 'react'
import { categoryColors } from '@/data/categories';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, MoreHorizontalIcon, RefreshCcw, RefreshCw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


const RECURRING_INTERVALS = {
  DAILY : "Daily",
  WEEKLY : "Weekly",
  MONTHLY : "Monthly",
  YEARLY : "Yearly"
}

function TransactionTable({transactions}) {
const router = useRouter();
const filteredAndSortedTransactions = transactions;
const [selectedIds, setSelectedIds] = useState([]);
const [sortConfig, setSortConfig] = useState({
        field : "date",
        direction : "desc",
});


const handleSort = (field) =>
{
  setSortConfig(current => ({
    field,
    direction: current.field == field && current.direction === "asc" ? "desc" : "asc",
  }))
}

  return (
    <div className='space-y-4'>
      {/*Filters */}
      {/*Transactions */}
      <div className='rounded-md-border'>
        <Table>
          <TableHeader >
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox/>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick = {() => handleSort("date")}><div className='flex items-center'>Date {" "}
                {sortConfig.field === "date" &&
                ( sortConfig.direction === "asc" ? (<ChevronUp className='ml-1 h-4 w-4'/>) : (<ChevronDown className='ml-1 h-4 w-4'/>)
                )}</div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead 
                className="w-[50px]"
                onClick = {() => handleSort("category")}><div className='flex items-center'>Category
                {sortConfig.field === "category" &&
                ( sortConfig.direction === "asc" ? (<ChevronUp className='ml-1 h-4 w-4'/>) : (<ChevronDown className='ml-1 h-4 w-4'/>)
                )}
                </div>
              </TableHead>
              <TableHead 
                className="w-[50px]"
                onClick = {() => handleSort("amount")}><div className='flex items-center justify-end'>Amount
                 {sortConfig.field === "amount" &&
                ( sortConfig.direction === "asc" ? (<ChevronUp className='ml-1 h-4 w-4'/>) : (<ChevronDown className='ml-1 h-4 w-4'/>)
                )}
                </div>
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

                <TableCell className="capitalize">
                  <span 
                      style = {{background: categoryColors[transactions.category]}} 
                    className='px-2 py-1 rounded text-white text-sm'>
                      {transactions.category}
                  </span>
                </TableCell>

                <TableCell className="text-right font-medium"
                style = {{
                  color : transactions.type === "EXPENESE" ? "red" : "green", 
                }}>
                  {transactions.type === "EXPENSE" ? "-" : "+"}
                  ${transactions.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  {transactions.isReccuring ? (
                    <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="gap-1 text-purple-900 bg-purple-200 ">
                        <RefreshCw className='h-3 w-3'/>
                        {
                            RECURRING_INTERVALS[
                              transactions.reccuringInterval ]
                        }
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className='text-sm'>
                          <div className='font-medium'>Next Date : </div>
                          <div>{format(new Date(transactions.nextRecurringDate), "PP")}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Clock className='h-3 w-3'/>One-time</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontalIcon className="h-4 w-4"/></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel
                        onClick = {() =>
                        {
                          router.push(`/transaction/create?edit = ${transactions.id}`)
                        }
                        }
                        >
                          Edit</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive" 
                          // onClick={()=> deleteFn[transactions.id]}
                        >Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
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