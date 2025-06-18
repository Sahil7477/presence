'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export default function AddStudentForm({ onAddStudent }: { onAddStudent: (data: { name: string; department: string; status: string }) => void }) {
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('Present')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !department || !status) return

    onAddStudent({ name, department, status })
    setName('')
    setDepartment('')
    setStatus('Present')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 bg-slate-900 p-4 rounded-lg border border-slate-700">
      <Input placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-800 text-white" />
      <Input placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-slate-800 text-white" />
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="bg-slate-800 text-white border-slate-600">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 text-white">
          <SelectItem value="Present">Present</SelectItem>
          <SelectItem value="Late">Late</SelectItem>
          <SelectItem value="Absent">Absent</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">Add Student</Button>
    </form>
  )
}
