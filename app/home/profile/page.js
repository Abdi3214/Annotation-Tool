export default function Profile() {
  return (
    <div className="dark:bg-[#0a0a0a;] p-6 ">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-200"></div>
        <div>
          <h2 className="text-xl font-bold">Maxamed Axmed</h2>
          <p className="text-gray-600">maxamed@example.com</p>
          <p className="text-sm text-gray-400">Joined: Jan 12, 2024</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between">
          <p>Completed Annotations</p>
          <span className="font-medium">124</span>
        </div>
        <div className="flex justify-between">
          <p>Pending Reviews</p>
          <span className="font-medium">6</span>
        </div>
        <div>
          <p className="mb-1">Progress</p>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="w-2/3 h-2 bg-blue-600 rounded-full"></div>
          </div>
          <p className="text-sm text-right text-gray-500 mt-1">65%</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <ul className="text-sm space-y-1">
            <li><strong>April 16:</strong> Annotated Text ID 2374</li>
            <li><strong>April 15:</strong> Commented on ID 2369</li>
            <li><strong>April 13:</strong> Reviewed 5 texts</li>
          </ul>
        </div>
        <div className="flex space-x-4 mt-6">
          <button className="btn btn-primary px-4 py-2 border rounded hover:bg-gray-100 border-gray-200 shadow-sm">Edit Profile</button>
          <button className="btn btn-primary px-4 py-2 border rounded border-gray-200 hover:bg-gray-100 shadow-sm">Change Password</button>
        </div>
      </div>
    </div>
  );
}