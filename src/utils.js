import { supabase } from './supabaseConfig'

// Upload file to storage
export const uploadFile = async (file) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `updates/${fileName}`

    const { data, error } = await supabase.storage
      .from('bee-updates') // your bucket name
      .upload(filePath, file)

    if (error) throw error

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('bee-updates')
      .getPublicUrl(filePath)

    return publicUrl.publicUrl
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

// Save update to database
export const saveUpdate = async (updateData) => {
  try {
    const { data, error } = await supabase
      .from('updates') // your table name
      .insert([
        {
          media_url: updateData.mediaUrl,
          media_type: updateData.mediaType,
          caption: updateData.caption,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Save update error:', error)
    throw error
  }
}

// Fetch all updates
export const fetchUpdates = async () => {
  try {
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Fetch updates error:', error)
    throw error
  }
}

// Delete update
export const deleteUpdate = async (id, mediaUrl) => {
  try {
    // Delete from storage
    if (mediaUrl) {
      const filePath = mediaUrl.split('/').pop()
      await supabase.storage
        .from('bee-updates')
        .remove([`updates/${filePath}`])
    }

    // Delete from database
    const { error } = await supabase
      .from('updates')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Delete update error:', error)
    throw error
  }
}