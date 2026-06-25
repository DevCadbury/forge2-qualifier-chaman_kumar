<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::all();
        return response()->json($tags);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags',
            'color' => 'nullable|string|max:7',
        ]);

        $tag = Tag::create($validated);
        return response()->json($tag, 201);
    }

    public function show($id)
    {
        $tag = Tag::with('cards')->findOrFail($id);
        return response()->json($tag);
    }

    public function update(Request $request, $id)
    {
        $tag = Tag::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:tags,name,'.$id,
            'color' => 'nullable|string|max:7',
        ]);

        $tag->update($validated);
        return response()->json($tag);
    }

    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();
        return response()->json(['message' => 'Tag deleted successfully']);
    }
}
