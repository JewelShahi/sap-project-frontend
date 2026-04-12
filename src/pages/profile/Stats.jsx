import React from 'react'
import Animate from "@/components/animation/Animate"
import StatCard from './components/StatCard'

const Stats = ({profile}) => {
  return (
    <Animate variant="fade-up">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<BarChart3 size={20} />}
          label="Reviews"
          value={profile?.reviews_count}
          className="bg-glass-purple border-purple/20 text-purple"
        />
        <StatCard
          icon={<Camera size={20} />}
          label="Pending"
          value={profile?.pending_count}
          className="bg-glass-teal border-teal/20 text-teal"
        />
        <StatCard
          icon={<User size={20} />}
          label="Versions"
          value={profile?.versions_count}
          className="bg-primary/10 border-primary/20 text-primary"
        />
      </div>
    </Animate>
  )
}

export default Stats