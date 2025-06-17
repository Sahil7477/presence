'use client';

import React from 'react';
import {
  Calendar, Clock, User, Users, Check, X, Search
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import QRCodeGenerator from '@/components/QRGenerator';

// Mock data
const attendanceData = [
  { name: 'Mon', present: 40, absent: 5, late: 3 },
  { name: 'Tue', present: 42, absent: 3, late: 2 },
  { name: 'Wed', present: 41, absent: 4, late: 2 },
  { name: 'Thu', present: 38, absent: 7, late: 4 },
  { name: 'Fri', present: 35, absent: 10, late: 5 },
];

const employeeData = [
  { id: 1, name: 'Alex Johnson', department: 'Engineering', status: 'Present', time: '8:30 AM', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Sarah Miller', department: 'Marketing', status: 'Late', time: '9:15 AM', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Michael Brown', department: 'Design', status: 'Present', time: '8:45 AM', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Emily Wilson', department: 'HR', status: 'Absent', time: '-', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'David Garcia', department: 'Finance', status: 'Present', time: '8:55 AM', avatar: 'https://i.pravatar.cc/150?img=5' },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getColor = () => {
    switch (status) {
      case 'Present': return "bg-green-800 text-green-200";
      case 'Late': return "bg-yellow-700 text-yellow-100";
      case 'Absent': return "bg-red-700 text-red-100";
      default: return "bg-gray-700 text-gray-100";
    }
  };

  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>{status}</span>;
};

// Employee table component
const EmployeeTable = () => (
  <div className="rounded-lg border border-slate-700 overflow-hidden">
    <Table>
      <TableHeader className="bg-slate-800">
        <TableRow>
          <TableHead className="text-white">Employee</TableHead>
          <TableHead className="text-white">Department</TableHead>
          <TableHead className="text-white">Status</TableHead>
          <TableHead className="text-white">Check-in Time</TableHead>
          <TableHead className="text-white">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employeeData.map((employee) => (
          <TableRow key={employee.id} className="bg-slate-900 text-white">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={employee.avatar} />
                  <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>{employee.name}</div>
              </div>
            </TableCell>
            <TableCell>{employee.department}</TableCell>
            <TableCell><StatusBadge status={employee.status} /></TableCell>
            <TableCell>{employee.time}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

// Dashboard
const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-bold text-xl">AttendEase</h1>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-indigo-400 font-medium">Dashboard</a>
          <a href="#" className="text-slate-300 hover:text-indigo-400">Employees</a>
          <a href="#" className="text-slate-300 hover:text-indigo-400">Reports</a>
          <a href="#" className="text-slate-300 hover:text-indigo-400">Settings</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Search..." className="pl-9 w-64 bg-slate-800 text-white border border-slate-700" />
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/150?img=8" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Attendance Dashboard</h1>
          <p className="text-slate-400">Monitor daily attendance and employee status</p>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: "48", icon: <Users className="h-5 w-5 text-blue-400" />, bg: "bg-blue-900" },
            { label: "Present", value: "42", icon: <Check className="h-5 w-5 text-green-400" />, bg: "bg-green-900" },
            { label: "Late", value: "3", icon: <Clock className="h-5 w-5 text-yellow-400" />, bg: "bg-yellow-900" },
            { label: "Absent", value: "3", icon: <X className="h-5 w-5 text-red-400" />, bg: "bg-red-900" },
          ].map(({ label, value, icon, bg }, i) => (
            <Card key={i} className={`${bg}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">{icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-900 lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Attendance Overview</CardTitle>
                <Select defaultValue="week">
                  <SelectTrigger className="w-36 bg-slate-800 text-white border-slate-700">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white">
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip />
                    <Bar dataKey="present" fill="#10b981" name="Present" />
                    <Bar dataKey="late" fill="#facc15" name="Late" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Summary + QR Generator */}
        
        </div>

        {/* Attendance Table */}
        <Card className="mt-6 bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Employee Attendance</CardTitle>
              <CardDescription className="text-slate-400">Today's attendance record</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-600 text-white">Export</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">+ Add Record</Button>
            </div>
          </CardHeader>
          <CardContent>
            <EmployeeTable />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
