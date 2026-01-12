// Get group data from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const groupName = urlParams.get('group');

// Group data
const groupData = {
    'greenthumb-club': {
        name: 'GreenThumb Club',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
        members: 156,
        description: 'Join our community of garden enthusiasts! Whether you\'re a seasoned gardener or just starting out, we welcome everyone who loves plants and wants to learn more about sustainable gardening practices.',
        tags: ['Nature', 'Outdoor', 'Community'],
        location: 'Community Garden, 123 Park Ave',
        time: 'Every Saturday, 10:00 AM',
        organizer: 'Sarah Johnson'
    },
    'biidaasige-park-nature-walk': {
        name: 'Biidaasige Park Nature Walk',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        members: 89,
        description: 'Explore the beautiful trails of Biidaasige Park with fellow nature lovers. We organize weekly walks to observe wildlife, identify plants, and enjoy the outdoors together.',
        tags: ['Nature', 'Walking', 'Outdoor'],
        location: 'Biidaasige Park Entrance',
        time: 'Every Sunday, 9:00 AM',
        organizer: 'Michael Chen'
    },
    'native-plant-care': {
        name: 'Native Plant Care',
        image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
        members: 72,
        description: 'Learn about caring for native plants and creating sustainable gardens. Share tips, swap seeds, and help preserve local plant species.',
        tags: ['Nature', 'Gardening', 'Conservation'],
        location: 'Native Plant Nursery',
        time: 'First Thursday, 6:00 PM',
        organizer: 'Emma Rodriguez'
    },
    'urban-bird-insect-spotting': {
        name: 'Urban Bird & Insect Spotting',
        image: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800',
        members: 134,
        description: 'Discover the amazing diversity of birds and insects in our urban environment. Bring your binoculars and join us for guided spotting sessions.',
        tags: ['Nature', 'Wildlife', 'Photography'],
        location: 'Various city parks',
        time: 'Every Saturday, 7:00 AM',
        organizer: 'David Park'
    }
};

// Load group data
if (groupName && groupData[groupName]) {
    const group = groupData[groupName];
    
    document.getElementById('groupTitle').textContent = group.name;
    document.getElementById('groupName').textContent = group.name;
    document.getElementById('groupImage').src = group.image;
    document.getElementById('groupImage').alt = group.name;
    document.getElementById('memberCount').textContent = `${group.members} Members`;
    document.getElementById('groupDescription').textContent = group.description;
    document.getElementById('groupLocation').textContent = group.location;
    document.getElementById('groupTime').textContent = group.time;
    document.getElementById('groupOrganizer').textContent = group.organizer;
    
    // Update tags
    const tagsContainer = document.getElementById('groupTags');
    tagsContainer.innerHTML = '';
    group.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-primary text-xs font-medium rounded-full';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
} else {
    // Default to GreenThumb Club if no valid group specified
    console.log('No valid group specified, showing default');
}
