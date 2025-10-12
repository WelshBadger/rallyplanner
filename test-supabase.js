const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Test connection
    const { data, error } = await supabase
      .from('team_members')
      .select('count', { count: 'exact' });

    if (error) {
      console.error('❌ Supabase Error:', error);
      return false;
    }

    console.log('✅ Supabase connected, team members count:', data);
    
    // Test insert
    const testMember = {
      name: 'Test Driver',
      role: 'Driver',
      email: 'test@rally.com',
      phone: '+44123456789',
      emergency_contact_name: 'Emergency Contact',
      emergency_contact_phone: '+44987654321'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('team_members')
      .insert([testMember])
      .select();

    if (insertError) {
      console.error('❌ Insert Error:', insertError);
      return false;
    }

    console.log('✅ Test member inserted:', insertData[0].id);

    // Clean up test data
    await supabase
      .from('team_members')
      .delete()
      .eq('id', insertData[0].id);

    console.log('✅ Test data cleaned up');
    return true;

  } catch (error) {
    console.error('💥 Supabase Test Failed:', error);
    return false;
  }
}

testSupabase();
