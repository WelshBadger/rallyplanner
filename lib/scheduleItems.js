import { supabase } from './supabase'

export async function addScheduleItem(user, rallyId, scheduleData) {
  try {
    const { error } = await supabase.from('schedule_items').insert({
      user_id: user.id,
      rally_id: rallyId,
      title: scheduleData.title,
      event_date: scheduleData.event_date,
      event_time: scheduleData.event_time,
      type: scheduleData.type || 'other',
      location: scheduleData.location,
      description: scheduleData.description
    })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Schedule Item Error:', error)
    return { success: false, error: error.message }
  }
}
