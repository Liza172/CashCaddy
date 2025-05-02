"use client"
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react'
import { categoryColors } from '@/data/categories';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, MoreHorizontalIcon, RefreshCcw, RefreshCw, Search, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SelectContent, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { Select, SelectItem } from '@/components/ui/select';


const RECURRING_INTERVALS = {
  DAILY : "Daily",
  WEEKLY : "Weekly",
  MONTHLY : "Monthly",
  YEARLY : "Yearly"
}

function TransactionTable({transactions}) {
const router = useRouter();
// const filteredAndSortedTransactions = transactions;
const [selectedIds, setSelectedIds] = useState([]);
const [sortConfig, setSortConfig] = useState({
        field : "date",
        direction : "desc",
});

const [searchTerm, setSearchTerm] = useState("");
const [typeFilter, setTypeFilter] = useState("");
const [recurringFilter, setRecurringFilter] = useState("");

const handleSort = (field) =>
{
  setSortConfig(current => ({
    field,
    direction: current.field == field && current.direction === "asc" ? "desc" : "asc",
  }))
}
const filteredAndSortedTransactions = useMemo(() =>{
  let result = [...transactions];
//Apply Search filter
if(searchTerm)
{
    const searchLower = searchTerm.toLowerCase();
    result = result.filter((transactions)=>
      transactions.description?.toLowerCase().includes(searchLower)
    );
}
if(recurringFilter)
{
      result = result.filter((transactions)=>
      {
        if(recurringFilter === "recurring") 
               return transactions.isReccuring;
        return !transactions.isReccuring;
      });   
}

  return result;
}, [transactions,
  searchTerm,
  typeFilter,
  recurringFilter,
  sortConfig,]);
const handleSelect = (id) =>
{
  setSelectedIds(current => current.includes(id)?
  current.filter(item=>item!=id):
  [...current,id])
}
const handleSelectAll = () =>
  {
    setSelectedIds((current) =>
    {
      current.length === filteredAndSortedTransactions.length 
      ? []
      : filteredAndSortedTransactions.map((t) => t.id)

    })
  };
const handleBulkDelete = () =>
{

};
const handleClearFilters = () =>
{
  setSearchTerm("");
  setTypeFilter("");
  setRecurringFilter("");
  setSelectedIds([]);
};
  return (
    <div className='space-y-4'>
      {/*Filters */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground'/>
          <Input className="pl-8"
            placeholder = "search transaction..."
            value = {searchTerm}
            onChange = {(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='flex gap-2'>
          <Select value={typeFilter} onValueChange = {setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem></SelectItem>
            </SelectContent>
          </Select>
          <Select value={recurringFilter} onValueChange ={(value) => setRecurringFilter(value)}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder="All Transactions"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
              <SelectItem></SelectItem>
            </SelectContent>
          </Select>
          {selectedIds.length > 0 && (<div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleBulkDelete}>
                <Trash className='h-4 w-4 mr-2'/>
                Delete Selected({selectedIds.length})
              </Button>      
          </div>
            )}

            {(searchTerm || typeFilter || recurringFilter) && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick = {handleClearFilters} 
                title="Clear Filters">
                  <X className="h04 w-5" />
              </Button>
            )}
        </div>
      </div>
      {/*Transactions */}
      <div className='rounded-md-border'>
        <Table>
          <TableHeader >
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox onCheckedChange= {handleSelectAll}
                checked = {
                  selectedIds.length === 
                  filteredAndSortedTransactions.length && 
                  filteredAndSortedTransactions.length > 0
                }
                />
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
                <TableCell><Checkbox onCheckedChange = {() =>handleSelect(transactions.id)}
                checked = {selectedIds.includes(transactions.id)}
                /></TableCell>
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