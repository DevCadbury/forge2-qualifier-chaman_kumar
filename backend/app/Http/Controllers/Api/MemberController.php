<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index()
    {
        $members = Member::all();
        return response()->json($members);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members',
            'avatar' => 'nullable|string',
        ]);

        $member = Member::create($validated);
        return response()->json($member, 201);
    }

    public function show($id)
    {
        $member = Member::with('cards')->findOrFail($id);
        return response()->json($member);
    }

    public function update(Request $request, $id)
    {
        $member = Member::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:members,email,'.$id,
            'avatar' => 'nullable|string',
        ]);

        $member->update($validated);
        return response()->json($member);
    }

    public function destroy($id)
    {
        $member = Member::findOrFail($id);
        $member->delete();
        return response()->json(['message' => 'Member deleted successfully']);
    }
}
