export default function Register() {
  return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[350px] sm:w-[400px] rounded-2xl shadow-xl bg-yellow-100 p-6">
          <h2 className="text-lg font-semibold mb-1 text-black">Hello...</h2>
          <h1 className="text-2xl font-bold mb-6 text-black">Register</h1>
          {/* Username / Email */}
          <div className="mb-4">
            <label className="block text-sm mb-1 text-black">Username / Email</label>
            <input
              type="text"
              placeholder="info@example.com"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black border-black text-gray-800"
            />
          </div>

          {/* Course */}
          <div className="mb-4">
            <label className="block text-sm mb-1 text-black">Course</label>
            <input
              type="text"
              placeholder="course"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black border-black text-gray-800"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm mb-1 text-black">Password</label>
            <input
              type="password"
              placeholder="password"
              className="w-full px-3 py-2 border rounded-lg border-black focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm mb-1 text-black">Confirm Password</label>
            <input
              type="password"
              placeholder="confirm password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black border-black text-gray-800"
            />
          </div>

          {/* Submit */}
          <button className="w-full py-2 bg-black text-yellow-100 font-semibold rounded-lg hover:bg-gray-800">
            Register
          </button>

          {/* Login link */}
          <p className="mt-4 text-center text-sm text-black">
            Already have an account?{" "}
            <a href="/login" className="text-red-500 font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
  );
}
