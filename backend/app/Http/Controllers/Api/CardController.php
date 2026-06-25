<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BoardList;
use App\Models\Card;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index($boardId, $listId)
    {
        $list = BoardList::where('board_id', $boardId)->findOrFail($listId);
        $cards = $list->cards()->with('tags', 'members')->orderBy('position')->get();
        return response()->json($cards);
    }

    public function store(Request $request, $boardId, $listId)
    {
        $list = BoardList::where('board_id', $boardId)->findOrFail($listId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'position' => 'nullable|integer',
            'due_date' => 'nullable|date',
        ]);

        $validated['list_id'] = $listId;
        $validated['position'] = $validated['position'] ?? $list->cards()->count();

        $card = Card::create($validated);
        return response()->json($card->load('tags', 'members'), 201);
    }

    public function show($boardId, $listId, $cardId)
    {
        $card = Card::where('list_id', $listId)
            ->with('tags', 'members', 'list')
            ->findOrFail($cardId);
        return response()->json($card);
    }

    public function update(Request $request, $boardId, $listId, $cardId)
    {
        $card = Card::where('list_id', $listId)->findOrFail($cardId);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'position' => 'sometimes|integer',
            'due_date' => 'nullable|date',
        ]);

        $card->update($validated);
        return response()->json($card->load('tags', 'members'));
    }

    public function destroy($boardId, $listId, $cardId)
    {
        $card = Card::where('list_id', $listId)->findOrFail($cardId);
        $card->delete();
        return response()->json(['message' => 'Card deleted successfully']);
    }

    public function move(Request $request, $boardId, $listId, $cardId)
    {
        $validated = $request->validate([
            'list_id' => 'required|exists:lists,id',
            'position' => 'required|integer|min:0',
        ]);

        $card = Card::findOrFail($cardId);
        $card->update([
            'list_id' => $validated['list_id'],
            'position' => $validated['position'],
        ]);

        return response()->json($card->load('tags', 'members', 'list'));
    }

    public function attachTag($cardId, $tagId)
    {
        $card = Card::findOrFail($cardId);
        $card->tags()->syncWithoutDetaching([$tagId]);
        return response()->json($card->load('tags'));
    }

    public function detachTag($cardId, $tagId)
    {
        $card = Card::findOrFail($cardId);
        $card->tags()->detach($tagId);
        return response()->json($card->load('tags'));
    }

    public function assignMember($cardId, $memberId)
    {
        $card = Card::findOrFail($cardId);
        $card->members()->syncWithoutDetaching([$memberId]);
        return response()->json($card->load('members'));
    }

    public function removeMember($cardId, $memberId)
    {
        $card = Card::findOrFail($cardId);
        $card->members()->detach($memberId);
        return response()->json($card->load('members'));
    }

    public function setDueDate(Request $request, $cardId)
    {
        $validated = $request->validate([
            'due_date' => 'required|date',
        ]);

        $card = Card::findOrFail($cardId);
        $card->update(['due_date' => $validated['due_date']]);
        return response()->json($card);
    }

    public function removeDueDate($cardId)
    {
        $card = Card::findOrFail($cardId);
        $card->update(['due_date' => null]);
        return response()->json($card);
    }
}
