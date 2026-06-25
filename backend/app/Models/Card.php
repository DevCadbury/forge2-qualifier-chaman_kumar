<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    use HasFactory;

    protected $fillable = [
        'list_id',
        'title',
        'description',
        'position',
        'due_date',
    ];

    protected $casts = [
        'position' => 'integer',
        'due_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function list()
    {
        return $this->belongsTo(BoardList::class, 'list_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'card_tag');
    }

    public function members()
    {
        return $this->belongsToMany(Member::class, 'card_member');
    }
}
